import React, { useState, useRef } from 'react';
// Importez ici vos composants shadcn
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Save, Paperclip, SendHorizonal, MessageSquareReply , Undo2, Heart} from 'lucide-react';
// Exemple d'icône trombone en SVG
const TromboneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.24 7.76a4 4 0 11-5.66 5.66M15 12h.01M12 12h.01M9 12h.01M7 12h.01M5 12h.01M3 12h.01" />
  </svg>
);

const Comment = ({ comment, onLike, onSelectReplyTarget }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Avatar>
            <AvatarImage src={comment.avatar || '/avatar-placeholder.png'} alt={comment.name} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold">{comment.name}</span>
        </div>
        <span className="text-xs text-gray-500">{comment.date}</span>
      </div>
      <div>
        {/* Étoiles de notation */}
        <div className="flex items-center mb-2 text-md">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="text-yellow-500">
              {i < comment.rating ? '★' : '☆'}
            </span>
          ))}
        </div>
        <p className='text-xs'>{comment.text}</p>
      </div>
      <div className="flex items-start justify-start">
        <div className="flex items-start justify-start">
          <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
            <span className="text-gray-700"><Heart/></span> {comment.likes}
          </Button>
          <Button className="border-none shadow-none" variant="outline" size="sm" onClick={() => onSelectReplyTarget(comment.id)}>
            <MessageSquareReply size={15}/>
          </Button>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="px-6 py-4 space-y-4 ">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="pl-4 ">
              <p className="text-sm font-bold">{reply.name} :</p>
              <p className='text-xs'>{reply.text}</p>
              {reply.image && (
                <img src={reply.image} alt="Réponse" className="max-w-xs mt-2 rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsList = () => {
  // Données fictives initialisées en JSON pour les commentaires
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Jean Dupont',
      date: '2025-04-07',
      rating: 2,
      text: "C'est un excellent service, très satisfait!",
      likes: 2,
      replies: [],
      avatar: ''
    },
    {
      id: 2,
      name: 'Marie Durand',
      date: '2025-04-06',
      rating: 5,
      text: "Expérience formidable et équipe au top !",
      likes: 5,
      replies: [
        {
          id: 101,
          name: 'Durand DePaul',
          text: 'Merci pour votre retour positif !',
          image: null
        }
      ],
      avatar: ''
    }
  ]);

  // Réponses générales (hors d'un commentaire spécifique)
  const [generalReplies, setGeneralReplies] = useState([]);

  // État du formulaire de réponse global
  const [replyForm, setReplyForm] = useState({
    replyText: '',
    replyImage: null,
    // Si null, il s'agit d'une réponse générale, sinon c'est l'ID du commentaire ciblé
    targetId: null,
  });

  // Référence pour l'input de fichier masqué
  const fileInputRef = useRef(null);

  // Fonction pour incrémenter le like d'un commentaire
  const handleLike = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Sélectionner la cible de la réponse
  const handleSelectReplyTarget = (targetId) => {
    setReplyForm((prev) => ({ ...prev, targetId }));
  };

  // Gestion du changement de texte du formulaire
  const handleReplyTextChange = (e) => {
    setReplyForm((prev) => ({ ...prev, replyText: e.target.value }));
  };

  // Gestion du changement d'image dans le formulaire
  const handleReplyImageChange = (e) => {
    setReplyForm((prev) => ({ ...prev, replyImage: e.target.files[0] }));
  };

  // Fonction de traitement de l'envoi du formulaire de réponse
  const handleSubmitReply = (e) => {
    e.preventDefault();

    const processReply = (imageDataUrl = null) => {
      const newReply = {
        id: Date.now(),
        name: 'Durand DePaul', // Nom fixe pour le répondeur
        text: replyForm.replyText,
        image: imageDataUrl,
      };

      if (replyForm.targetId) {
        // Réponse à un commentaire précis
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyForm.targetId
              ? { ...c, replies: [...c.replies, newReply] }
              : c
          )
        );
      } else {
        // Réponse générale
        setGeneralReplies((prev) => [...prev, newReply]);
      }
      // Réinitialisation du formulaire
      setReplyForm({ replyText: '', replyImage: null, targetId: null });
      // On vide la valeur de l'input fichier
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (replyForm.replyImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processReply(reader.result);
      };
      reader.readAsDataURL(replyForm.replyImage);
    } else {
      processReply();
    }
  };

  // Pour afficher le nom du commentaire auquel on répond (si applicable)
  const currentTargetName = replyForm.targetId
    ? comments.find((c) => c.id === replyForm.targetId)?.name
    : null;

  return (
    <div className="w-full px-4 mb-40 space-y-6">
      {/* Affichage des réponses générales */}
      {generalReplies.length > 0 && (
        <div className="p-4">
          {generalReplies.map((reply) => (
            <div key={reply.id} className="mb-4">
              <p className="font-bold">{reply.name} :</p>
              <p>{reply.text}</p>
              {reply.image && (
                <img src={reply.image} alt="Réponse générale" className="max-w-xs mt-2 rounded" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onLike={handleLike}
          onSelectReplyTarget={handleSelectReplyTarget}
        />
      ))}

      {/* Formulaire de réponse*/}
      <div className="fixed bottom-0 z-50 w-3/4 px-6 py-2 bg-white">
        <h2 className="flex items-center mb-4 text-xs font-bold text-gray-700">
          {replyForm.targetId ? `Répondre à ${currentTargetName}` : ''}
          {replyForm.targetId && (
              <Button
                variant="ghost"
                type="button"
                onClick={() =>
                  setReplyForm((prev) => ({ ...prev, targetId: null }))
                }
              >
                <Undo2/>
              </Button>
            )}
        </h2>
        <form onSubmit={handleSubmitReply} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Bouton icône trombone déclenchant l'input fichier caché */}
            <label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip size={15}/>
            </label>
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleReplyImageChange}
              accept="image/*"
              className="hidden"
            />
            <Input
              type='text'
              value={replyForm.replyText}
              onChange={handleReplyTextChange}
              placeholder="Votre réponse..."
              required
              className="flex-1"
            />
                      <div className="flex items-center gap-4">
            <Button type="submit" className="bg-[#5DA781]"><SendHorizonal/></Button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsList;
