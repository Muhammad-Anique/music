'use client';

import { Profile, WorkExperience, Education, Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Linkedin, Briefcase, GraduationCap, Wrench, FolderGit2, Upload, Save, Trash2, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ProfileBasicInfoForm } from "@/components/profile/profile-basic-info-form";
import { ProfileWorkExperienceForm } from "@/components/profile/profile-work-experience-form";
import { ProfileProjectsForm } from "@/components/profile/profile-projects-form";
import { ProfileEducationForm } from "@/components/profile/profile-education-form";
import { ProfileSkillsForm } from "@/components/profile/profile-skills-form";
import { formatProfileWithAI } from "../../utils/actions/profiles/ai";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";
import { AlertTriangle } from "lucide-react";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile: initialProfile }: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTextImportDialogOpen, setIsTextImportDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [textImportContent, setTextImportContent] = useState("");
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Add useEffect to clear error when dialogs close
  useEffect(() => {
    if (!isResumeDialogOpen && !isTextImportDialogOpen) {
      setApiKeyError("");
    }
  }, [isResumeDialogOpen, isTextImportDialogOpen]);

  const updateField = (field: keyof Profile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile(profile);
      toast.success("Changes saved successfully", {
        position: "bottom-right",
        className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
      });
      router.refresh();
    } catch (error) {
      void error;
      toast.error("Unable to save your changes. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "basic",
      title: "Basic Info",
      icon: <User className="h-5 w-5" />,
      content: (
        <ProfileBasicInfoForm
          profile={profile}
          onChange={(field, value) => {
            if (field in profile) {
              updateField(field as keyof Profile, value);
            }
          }}
        />
      )
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: <Briefcase className="h-5 w-5" />,
      content: (
        <ProfileWorkExperienceForm
          experiences={profile.work_experience}
          onChange={(experiences) => updateField('work_experience', experiences)}
        />
      )
    },
    {
      id: "projects",
      title: "Projects",
      icon: <FolderGit2 className="h-5 w-5" />,
      content: (
        <ProfileProjectsForm
          projects={profile.projects}
          onChange={(projects) => updateField('projects', projects)}
        />
      )
    },
    {
      id: "education",
      title: "Education",
      icon: <GraduationCap className="h-5 w-5" />,
      content: (
        <ProfileEducationForm
          education={profile.education}
          onChange={(education) => updateField('education', education)}
        />
      )
    },
    {
      id: "skills",
      title: "Skills",
      icon: <Wrench className="h-5 w-5" />,
      content: (
        <ProfileSkillsForm
          skills={profile.skills}
          onChange={(skills) => updateField('skills', skills)}
        />
      )
    }
  ];

  return (
    <div className="relative mx-auto">
      {/* Action Bar */}
      <div className="z-50 mt-4">
        <div className="max-w-[2000px] mx-auto">
          <div className="mx-6 mb-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600" />
                <span className="text-sm font-medium text-muted-foreground">Profile Editor</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Save Button */}
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  size="sm"
                  className="relative bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-teal-500/20 h-9 px-4 group"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,#ffffff20_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="relative px-6 md:px-8 lg:px-10 pb-10">
        {/* Profile Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="relative">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-md'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeSection === section.id 
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${
                  activeSection === section.id ? 'rotate-180 text-blue-600' : 'text-gray-400'
                }`} />
              </button>

              {/* Pop-up style content */}
              <div className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                activeSection === section.id 
                  ? 'max-h-[1500px] opacity-100'
                  : 'max-h-0 opacity-0'
              }`}>
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  {section.content}
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Import Options */}
        <div className="mt-8 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-purple-600/60">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm shadow-purple-500/20" />
                <span className="font-medium">Import Options</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* LinkedIn Import Button */}
              <Button
                variant="outline"
                onClick={() => toast.info("LinkedIn import feature coming soon!")}
                className="group relative bg-[#0077b5]/5 hover:bg-[#0077b5]/10 border-[#0077b5]/20 hover:border-[#0077b5]/30 text-[#0077b5] transition-all duration-500 hover:scale-[1.02] h-auto py-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0077b5]/0 via-[#0077b5]/5 to-[#0077b5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077b5]/10 group-hover:scale-110 transition-transform duration-500">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[#0077b5]">LinkedIn Import</div>
                    <div className="text-sm text-[#0077b5]/70">Sync with your LinkedIn profile</div>
                  </div>
                </div>
              </Button>

              {/* Resume Upload Button */}
              <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="group relative bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/20 hover:border-violet-500/30 text-violet-600 transition-all duration-500 hover:scale-[1.02] h-auto py-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 group-hover:scale-110 transition-transform duration-500">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-violet-600">Resume Upload</div>
                        <div className="text-sm text-violet-600/70">Import from existing resume</div>
                      </div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Upload Resume Content
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-2 text-base text-muted-foreground/80">
                        <span className="block">Let our AI analyze your resume and enhance your profile by adding new information.</span>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                      placeholder="Paste your resume content here..."
                      className="min-h-[100px] bg-white/50 border-white/40 focus:border-violet-500/40 focus:ring-violet-500/20 transition-all duration-300"
                    />
                  </div>
                  {apiKeyError && (
                    <div className="px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                      <div className="p-1.5 rounded-full bg-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">API Key Required</p>
                        <p className="text-red-500/90">{apiKeyError}</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsResumeDialogOpen(false)}
                      className="bg-white/50 hover:bg-white/60 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleResumeUpload(resumeContent)}
                      disabled={isProcessingResume || !resumeContent.trim()}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-500 hover:scale-[1.02] disabled:hover:scale-100"
                    >
                      {isProcessingResume ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Process with AI</span>
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}