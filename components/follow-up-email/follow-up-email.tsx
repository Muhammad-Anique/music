import FollowUpEmailEditor from "./follow-up-email-editor";
import { useRef, useCallback,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useResumeContext } from '@/components/resume/editor/resume-editor-context';


interface FollowUpEmailProps {
    containerWidth: number;
    
}


export default function FollowUpEmail({ containerWidth }: FollowUpEmailProps) {
  const { state, dispatch } = useResumeContext();
  const contentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
      if (state.resume.has_follow_up_email) {
        return;
      }
      dispatch({
        type: "UPDATE_FIELD",
          field: 'has_follow_up_email',
        value: true,
      });
  }, [dispatch]);

  
  const handleContentChange = useCallback((data: Record<string, unknown>) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'follow_up_email',
      value: {
        content: data.content,
        lastUpdated: new Date().toISOString()
      }
    });
  }, [dispatch]);


  if (!state.resume.has_follow_up_email) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-emerald-600/50 text-emerald-700 hover:bg-emerald-50"
          onClick={() => dispatch({
            type: 'UPDATE_FIELD',
            field: 'has_follow_up_email',
            value: true
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Follow Up Email
        </Button>
      </div>
    );
  }

  return (
    <div className="">
      {/* Print version */}
      <div 
        ref={contentRef} 
        id="follow-up-email-content"
        className="absolute -left-[9999px] w-[816px]"
      >
        <div 
          className="p-16 prose prose-sm !max-w-none"
          dangerouslySetInnerHTML={{ __html: state.resume.follow_up_email?.content || '' }} 
        />
      </div>
      
      {/* Interactive editor */}
      <div className="[&_.print-hidden]:hidden">
        <FollowUpEmailEditor 
          initialData={{ content: state.resume.follow_up_email?.content || '' }}
          onChange={handleContentChange}
          containerWidth={containerWidth}
        />
      </div>
      
      {/* <Button
        variant="outline"
        size="sm"
        className="w-full border-blue-600/50 text-blue-700 hover:bg-blue-50"
        onClick={handleExportPDF}
      >
        <Download className="h-4 w-4 mr-2" />
        Export as PDF
      </Button> */}
    </div>
  );
}

