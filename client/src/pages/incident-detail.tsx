import { useState } from "react";
import { useRoute, Link } from "wouter";
import { 
  ArrowLeft, Upload, Plus, Calendar, LinkIcon, 
  FileText, Image, Video, Music, AlertTriangle, Clock,
  Eye, Trash2, Download, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function IncidentDetail() {
  const [match] = useRoute("/incidents/:id");
  const incidentId = match ? (match as any).params?.id : null;

  // Mock incident data
  const incident = {
    id: incidentId,
    title: "Puppy Mill Investigation - Sunshine Rescue",
    severity: "critical",
    status: "investigating",
    createdAt: "2025-01-01",
    description: "Multiple reports of overcrowded conditions and sick animals at Sunshine Rescue facility",
    animalWelfareImpact: "Over 50 dogs found in unsanitary conditions with limited access to food and water",
    recommendedActions: "Immediate investigation by local authorities and temporary closure of facility"
  };

  // Mock evidence files
  const evidenceFiles = [
    {
      id: 1,
      filename: "overcrowded_kennels.jpg",
      type: "photo",
      description: "Photo showing overcrowded kennel conditions",
      source: "Anonymous volunteer",
      uploadedAt: "2025-01-01",
      isVerified: true
    },
    {
      id: 2,
      filename: "medical_records.pdf",
      type: "document", 
      description: "Missing vaccination records for 15 dogs",
      source: "Former employee",
      uploadedAt: "2025-01-02",
      isVerified: false
    },
    {
      id: 3,
      filename: "facility_walkthrough.mp4",
      type: "video",
      description: "Video tour showing poor conditions throughout facility", 
      source: "Undercover investigator",
      uploadedAt: "2025-01-03",
      isVerified: true
    }
  ];

  // Mock timeline entries
  const timeline = [
    {
      id: 1,
      date: "2025-01-01",
      title: "Initial Report Received",
      description: "Anonymous tip received about overcrowding at Sunshine Rescue",
      type: "report",
      severity: "medium",
      media: { type: "image", url: "/path/to/image.jpg" },
      link: { url: "https://external-article.com", text: "Read more" }
    },
    {
      id: 2,
      date: "2025-01-02", 
      title: "Photo Evidence Submitted",
      description: "Volunteer submits photos showing overcrowded conditions",
      type: "incident",
      severity: "high"
    },
    {
      id: 3,
      date: "2025-01-03",
      title: "Undercover Investigation",
      description: "Video evidence collected during undercover visit",
      type: "incident", 
      severity: "critical"
    },
    {
      id: 4,
      date: "2025-01-04",
      title: "Authorities Contacted",
      description: "Local animal control and health department notified",
      type: "action_taken",
      severity: "high"
    }
  ];

  // Mock cross-references
  const crossReferences = [
    {
      id: 1,
      relatedIncidentId: 2,
      relatedTitle: "Fraudulent Adoption Fees - Happy Tails Inc",
      relationship: "same_individual",
      description: "Same director involved in both organizations"
    },
    {
      id: 2,
      relatedIncidentId: 4,
      relatedTitle: "Previous Violations - Sunshine Rescue 2023",
      relationship: "follow_up",
      description: "Previous violations at same facility in 2023"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "photo": return <Image className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "audio": return <Music className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  if (!incidentId) {
    return <div>Invalid incident ID</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/incidents">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Incidents
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={getSeverityColor(incident.severity) as any}>
              {incident.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {incident.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600">
              Created: {incident.createdAt}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">
            Evidence ({evidenceFiles.length})
          </TabsTrigger>
          <TabsTrigger value="timeline">
            Timeline ({timeline.length})
          </TabsTrigger>
          <TabsTrigger value="cross-refs">
            Cross-References ({crossReferences.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{incident.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Animal Welfare Impact</h3>
                  <p className="text-gray-700">{incident.animalWelfareImpact}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recommended Actions</h3>
                  <p className="text-gray-700">{incident.recommendedActions}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Image className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{evidenceFiles.length}</div>
                    <div className="text-sm text-gray-600">Evidence Files</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{timeline.length}</div>
                    <div className="text-sm text-gray-600">Timeline Entries</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <LinkIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{crossReferences.length}</div>
                    <div className="text-sm text-gray-600">Cross-References</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {evidenceFiles.filter(f => f.isVerified).length}
                    </div>
                    <div className="text-sm text-gray-600">Verified Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Evidence Management System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Upload and manage evidence files including photos, videos, documents, and audio recordings.
                  All evidence is tracked with source information and verification status.
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Evidence
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceFiles.map((file) => (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium text-sm">{file.filename}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {file.type}
                      </Badge>
                    </div>

                    {file.description && (
                      <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                    )}

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Source: {file.source}</p>
                      <p className="text-xs text-gray-500">Uploaded: {file.uploadedAt}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      {file.isVerified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Incident Timeline Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create a chronological timeline of events to track the progression of the incident
                  and document all key developments over time.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Timeline Entry
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {timeline.map((entry, index) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">{timeline.length - index}</span>
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-px bg-gray-200 h-16 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{entry.title}</h3>
                            <Badge variant={getSeverityColor(entry.severity) as any}>
                              {entry.severity}
                            </Badge>
                            <Badge variant="outline">
                              {entry.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{entry.date}</span>
                        </div>
                        <p className="text-gray-700">{entry.description}</p>

{entry.media && entry.media.type === "image" && (
  <img src={entry.media.url} alt="Timeline media" className="my-4" />
)}

{entry.media && entry.media.type === "video" && (
  <video controls className="my-4">
    <source src={entry.media.url} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
)}

{entry.link && (
  <a href={entry.link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
    {entry.link.text}
  </a>
)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Cross-References Tab */}
        <TabsContent value="cross-refs">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Incident Cross-Referencing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Link this incident to related cases to identify patterns, track repeat offenders,
                  and build comprehensive profiles of problematic organizations or individuals.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cross-Reference
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {crossReferences.map((crossRef) => (
                <Card key={crossRef.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <h3 className="font-medium">{crossRef.relatedTitle}</h3>
                        <Badge variant="outline">
                          {crossRef.relationship.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/incidents/${crossRef.relatedIncidentId}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {crossRef.description && (
                      <p className="text-gray-700">{crossRef.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}