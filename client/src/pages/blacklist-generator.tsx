import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blacklistPostSchema, templateSchema, type BlacklistPost, type Template, type Individual, type Organization } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatBlacklistPost, formatDateForDisplay } from "@/lib/formatters";
import {
  Shield,
  Users,
  VenetianMask,
  Building,
  Hash,
  Info,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Save,
  FolderOpen,
  X,
} from "lucide-react";
import { nanoid } from "nanoid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultValues: BlacklistPost = {
  caseTitle: "",
  incidentDate: "",
  caseStatus: "investigating",
  briefDescription: "",
  individuals: [],
  aliases: [],
  organizations: [],
  summaryStatement: "",
  hashtags: [],
};

export default function BlacklistGenerator() {
  const { toast } = useToast();
  const [templates, setTemplates] = useLocalStorage<Template[]>("blacklist-templates", []);
  const [expandedSections, setExpandedSections] = useState({
    mainInfo: true,
    individuals: true,
    aliases: false,
    organizations: false,
    summary: true,
  });
  const [newHashtag, setNewHashtag] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const form = useForm<BlacklistPost>({
    resolver: zodResolver(blacklistPostSchema),
    defaultValues,
  });

  const watchedData = form.watch();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addIndividual = () => {
    const currentIndividuals = form.getValues("individuals");
    form.setValue("individuals", [
      ...currentIndividuals,
      {
        id: nanoid(),
        name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        socialMedia: [""],
      },
    ]);
  };

  const removeIndividual = (index: number) => {
    const currentIndividuals = form.getValues("individuals");
    form.setValue(
      "individuals",
      currentIndividuals.filter((_, i) => i !== index)
    );
  };

  const moveIndividual = (index: number, direction: "up" | "down") => {
    const currentIndividuals = form.getValues("individuals");
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= currentIndividuals.length) return;
    
    const newIndividuals = [...currentIndividuals];
    [newIndividuals[index], newIndividuals[newIndex]] = [newIndividuals[newIndex], newIndividuals[index]];
    form.setValue("individuals", newIndividuals);
  };

  const addSocialMedia = (individualIndex: number) => {
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    updatedIndividuals[individualIndex].socialMedia.push("");
    form.setValue("individuals", updatedIndividuals);
  };

  const removeSocialMedia = (individualIndex: number, socialIndex: number) => {
    const currentIndividuals = form.getValues("individuals");
    const updatedIndividuals = [...currentIndividuals];
    updatedIndividuals[individualIndex].socialMedia = updatedIndividuals[individualIndex].socialMedia.filter((_, i) => i !== socialIndex);
    form.setValue("individuals", updatedIndividuals);
  };

  const addAlias = () => {
    const currentAliases = form.getValues("aliases");
    form.setValue("aliases", [...currentAliases, ""]);
  };

  const removeAlias = (index: number) => {
    const currentAliases = form.getValues("aliases");
    form.setValue("aliases", currentAliases.filter((_, i) => i !== index));
  };

  const moveAlias = (index: number, direction: "up" | "down") => {
    const currentAliases = form.getValues("aliases");
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= currentAliases.length) return;
    
    const newAliases = [...currentAliases];
    [newAliases[index], newAliases[newIndex]] = [newAliases[newIndex], newAliases[index]];
    form.setValue("aliases", newAliases);
  };

  const addOrganization = () => {
    const currentOrganizations = form.getValues("organizations");
    form.setValue("organizations", [
      ...currentOrganizations,
      {
        id: nanoid(),
        name: "",
        registration: "",
        website: "",
        phone: "",
        address: "",
      },
    ]);
  };

  const removeOrganization = (index: number) => {
    const currentOrganizations = form.getValues("organizations");
    form.setValue(
      "organizations",
      currentOrganizations.filter((_, i) => i !== index)
    );
  };

  const addHashtag = () => {
    if (!newHashtag.trim()) return;
    
    const currentHashtags = form.getValues("hashtags");
    const cleanTag = newHashtag.replace(/^#/, "").trim();
    
    if (!currentHashtags.includes(cleanTag)) {
      form.setValue("hashtags", [...currentHashtags, cleanTag]);
    }
    
    setNewHashtag("");
  };

  const removeHashtag = (index: number) => {
    const currentHashtags = form.getValues("hashtags");
    form.setValue("hashtags", currentHashtags.filter((_, i) => i !== index));
  };

  const copyToClipboard = async () => {
    const formattedText = formatBlacklistPost(watchedData);
    
    try {
      await navigator.clipboard.writeText(formattedText);
      toast({
        title: "Success",
        description: "Content copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: nanoid(),
      name: templateName,
      data: watchedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [...prev, newTemplate]);
    setTemplateName("");
    setShowSaveDialog(false);
    
    toast({
      title: "Success",
      description: "Template saved successfully!",
    });
  };

  const loadTemplate = (template: Template) => {
    form.reset(template.data);
    toast({
      title: "Success",
      description: `Template "${template.name}" loaded successfully!`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Success",
      description: "Template deleted successfully!",
    });
  };

  const renderPreview = () => {
    const data = watchedData;
    
    return (
      <div className="space-y-4 text-sm leading-relaxed">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            🚨 {data.caseTitle.toUpperCase() || "CASE TITLE"} 🚨
          </h1>
          {data.incidentDate && (
            <p className="text-gray-600">Case Date: {formatDateForDisplay(data.incidentDate)}</p>
          )}
          <p className="text-sm text-gray-500">
            Status: {data.caseStatus === "investigating" ? "Under Investigation" : 
                     data.caseStatus === "confirmed" ? "Confirmed Fraud" : "Resolved"}
          </p>
        </div>

        {data.briefDescription && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">📋 CASE OVERVIEW</h2>
            <p>{data.briefDescription}</p>
          </div>
        )}

        {data.individuals.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">👤 BLACKLISTED INDIVIDUALS</h2>
            {data.individuals.map((individual, index) => (
              <div key={individual.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-red-900 mb-2">Individual #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {individual.name && <p><strong>Name:</strong> {individual.name}</p>}
                  {individual.dob && <p><strong>DOB:</strong> {formatDateForDisplay(individual.dob)}</p>}
                  {individual.phone && <p><strong>Phone:</strong> {individual.phone}</p>}
                  {individual.email && <p><strong>Email:</strong> {individual.email}</p>}
                  {individual.address && <p><strong>Address:</strong> {individual.address}</p>}
                  {individual.socialMedia.filter(link => link.trim()).length > 0 && (
                    <p><strong>Social Media:</strong> {individual.socialMedia.filter(link => link.trim()).join(", ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.aliases.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">🎭 KNOWN ALIASES</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <ul className="list-disc list-inside text-sm space-y-1">
                {data.aliases.map((alias, index) => (
                  <li key={index}>{alias}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {data.organizations.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-3">🏢 ASSOCIATED ORGANIZATIONS</h2>
            {data.organizations.map((org, index) => (
              <div key={org.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-orange-900 mb-2">Organization #{index + 1}</h3>
                <div className="space-y-1 text-sm">
                  {org.name && <p><strong>Name:</strong> {org.name}</p>}
                  {org.registration && <p><strong>Registration:</strong> {org.registration}</p>}
                  {org.website && <p><strong>Website:</strong> {org.website}</p>}
                  {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
                  {org.address && <p><strong>Address:</strong> {org.address}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.summaryStatement && (
          <div className="border-t border-gray-200 pt-4">
            <h2 className="font-bold text-gray-900 mb-2">⚠️ WARNING SUMMARY</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm">{data.summaryStatement}</p>
            </div>
          </div>
        )}

        {data.hashtags.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500">Share this information to protect others from fraud</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-primary text-2xl mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">Blacklist Post Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Templates
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Save as Template
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          placeholder="Enter template name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={saveTemplate}>Save</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {templates.length > 0 && <DropdownMenuSeparator />}
                  
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between px-2 py-1.5 text-sm">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="flex-1 text-left hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        {template.name}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
                <p className="text-sm text-muted-foreground">Fill out the form to generate your blacklist post</p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Main Case Info Section */}
                <Collapsible open={expandedSections.mainInfo} onOpenChange={() => toggleSection("mainInfo")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
                      <div className="flex items-center">
                        <Info className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">Main Case Information</span>
                      </div>
                      {expandedSections.mainInfo ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 px-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Title</label>
                      <Input
                        placeholder="e.g., Investment Fraud Alert"
                        {...form.register("caseTitle")}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Incident</label>
                        <Input
                          type="date"
                          {...form.register("incidentDate")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Case Status</label>
                        <Select value={watchedData.caseStatus} onValueChange={(value) => form.setValue("caseStatus", value as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investigating">Under Investigation</SelectItem>
                            <SelectItem value="confirmed">Confirmed Fraud</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description</label>
                      <Textarea
                        rows={3}
                        placeholder="Provide a brief overview of the case..."
                        {...form.register("briefDescription")}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Blacklisted Individuals Section */}
                <Collapsible open={expandedSections.individuals} onOpenChange={() => toggleSection("individuals")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
                      <div className="flex items-center">
                        <Users className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">Blacklisted Individuals</span>
                        {watchedData.individuals.length > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {watchedData.individuals.length}
                          </Badge>
                        )}
                      </div>
                      {expandedSections.individuals ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 px-4">
                    {watchedData.individuals.map((individual, index) => (
                      <div key={individual.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Individual #{index + 1}</h4>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveIndividual(index, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveIndividual(index, "down")}
                              disabled={index === watchedData.individuals.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIndividual(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <Input
                              placeholder="Full legal name"
                              {...form.register(`individuals.${index}.name` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <Input
                              type="date"
                              {...form.register(`individuals.${index}.dob` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              {...form.register(`individuals.${index}.phone` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...form.register(`individuals.${index}.email` as const)}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <Textarea
                            rows={2}
                            placeholder="Full address including city, state, zip"
                            {...form.register(`individuals.${index}.address` as const)}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
                          <div className="space-y-2">
                            {individual.socialMedia.map((link, socialIndex) => (
                              <div key={socialIndex} className="flex items-center space-x-2">
                                <Input
                                  placeholder="https://facebook.com/profile"
                                  {...form.register(`individuals.${index}.socialMedia.${socialIndex}` as const)}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSocialMedia(index, socialIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addSocialMedia(index)}
                              className="text-primary"
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add Social Media Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={addIndividual}
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Individual
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Aliases Section */}
                <Collapsible open={expandedSections.aliases} onOpenChange={() => toggleSection("aliases")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
                      <div className="flex items-center">
                        <VenetianMask className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">Known Aliases</span>
                        {watchedData.aliases.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {watchedData.aliases.length}
                          </Badge>
                        )}
                      </div>
                      {expandedSections.aliases ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3 px-4">
                    {watchedData.aliases.map((alias, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Input
                          placeholder="Enter alias or alternative name"
                          {...form.register(`aliases.${index}` as const)}
                        />
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveAlias(index, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveAlias(index, "down")}
                            disabled={index === watchedData.aliases.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAlias(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addAlias}
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Alias
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Associated Organizations Section */}
                <Collapsible open={expandedSections.organizations} onOpenChange={() => toggleSection("organizations")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
                      <div className="flex items-center">
                        <Building className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">Associated Organizations</span>
                        {watchedData.organizations.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {watchedData.organizations.length}
                          </Badge>
                        )}
                      </div>
                      {expandedSections.organizations ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 px-4">
                    {watchedData.organizations.map((org, index) => (
                      <div key={org.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Organization #{index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrganization(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                            <Input
                              placeholder="Company or organization name"
                              {...form.register(`organizations.${index}.name` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                            <Input
                              placeholder="Business registration number"
                              {...form.register(`organizations.${index}.registration` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <Input
                              type="url"
                              placeholder="https://example.com"
                              {...form.register(`organizations.${index}.website` as const)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              {...form.register(`organizations.${index}.phone` as const)}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                          <Textarea
                            rows={2}
                            placeholder="Full business address"
                            {...form.register(`organizations.${index}.address` as const)}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addOrganization}
                      className="w-full border-dashed"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Organization
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                {/* Summary & Hashtags Section */}
                <Collapsible open={expandedSections.summary} onOpenChange={() => toggleSection("summary")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto border rounded-lg">
                      <div className="flex items-center">
                        <Hash className="text-primary mr-2 h-5 w-5" />
                        <span className="font-medium">Summary & Hashtags</span>
                      </div>
                      {expandedSections.summary ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 px-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Summary Statement</label>
                      <Textarea
                        rows={4}
                        placeholder="Provide a comprehensive summary of the case and warning to the public..."
                        {...form.register("summaryStatement")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {watchedData.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            #{tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHashtag(index)}
                              className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter hashtag (without #)"
                          value={newHashtag}
                          onChange={(e) => setNewHashtag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                        />
                        <Button onClick={addHashtag}>Add</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </CardHeader>
              <CardContent>
                {renderPreview()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
