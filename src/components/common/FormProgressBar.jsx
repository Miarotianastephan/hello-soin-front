import { Progress } from "@/components/ui/progress";

const FormProgressBar = ({ progress }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Progress
        value={progress}
        className="w-full sm:w-[60%] [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500 [&::-moz-progress-bar]:bg-blue-500"
      />
      <p className="text-xs text-gray-700">{progress}%</p>
    </div>
  );
};

export default FormProgressBar;
