import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Questions from "./Questions";
import type { QuestionType } from "@/app/types/types";

interface DialogPorps {
  questions: QuestionType[];
}

const PaperViewDialog: React.FC<DialogPorps> = ({ questions }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full mt-4 shadow-sm">
            View paper
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-screen max-h-[90%] overflow-y-auto p-6">
          <Questions questions={questions} readOnly={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaperViewDialog;
