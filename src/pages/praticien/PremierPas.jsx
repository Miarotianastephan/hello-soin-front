import React, { useState, useEffect } from "react";
const PremierPas = () => {
	
	return (
		<div className="px-6">
			<div className="border rounded py-4 flex flex-col items-center justify-center">
				<p className="text-xl font-bold text-gray-700"> 
					<span className="text-4xl">🎉</span> 
						Bienvenue sur 
					<span className="text-[#5DA781]"> HelloSoins</span> 
					<span className="text-4xl">🎉</span>
				</p>
				<p className="py-4 text-gray-500 text-md px-8 mx-8 flex flex-col items-center justify-center w-full">Nous sommes ravis de vous compter parmi nous ! <span>Votre espace praticien est maintenant prêt.</span></p>
			</div>
			<div className="flex items-center justify-between pt-4 gap-4">
				<div className="w-1/2 border rounded flex flex-col items-center justify-center p-6 ">
					<p className="flex flex-col items-center justify-center p-6 text-sm font-bold text-[#5DA781]">
						Compléter votre profile pour mieux vous presenter 
						<span className="text-sm font-bold text-gray-700"> à vos patients</span>
					</p>
				</div>
				<div className="w-1/2 border rounded flex flex-col items-center justify-center p-6 ">
				<p className="flex flex-col items-center justify-center p-6 text-sm font-bold text-[#5DA781]">
					Ajouter vos disponibilités
					<span className="text-sm font-bold text-gray-700">pour recevoir des rendez-vous</span>
				</p>
				</div>
			</div>
		</div>
	)
}

export default PremierPas;