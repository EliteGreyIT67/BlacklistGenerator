import { useState } from "react";
import { Link } from "wouter";
import { 
  Plus, Search, Calendar, AlertTriangle, Eye, Upload, 
  FileText, Image, Clock, LinkIcon, Database 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MockIncident {
  id: number;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "investigating" | "confirmed" | "blacklisted" | "resolved" | "ongoing";
  evidenceCount: number;
  timelineEntries: number;
  crossReferences: number;
  createdAt: string;
  description: string;
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data to demonstrate enhanced documentation features
  const mockIncidents: MockIncident[] = [
    {
      id: 1,
      title: "Puppy Mill Investigation - Sunshine Rescue",
      severity: "critical",
      status: "investigating",
      evidenceCount: 15,
      timelineEntries: 8,
      crossReferences: 3,
      createdAt: "2025-01-01",
      description: "Multiple reports of overcrowded conditions and sick animals"
    },
    {
      id: 2, 
      title: "Fraudulent Adoption Fees - Happy Tails Inc",
      severity: "high",
      status: "confirmed",
      evidenceCount: 7,
      timelineEntries: 12,
      crossReferences: 1,
      createdAt: "2024-12-28",
      description: "Collecting adoption fees without proper licensing"
    },
    {
      id: 3,
      title: "Neglect Case - Furry Friends Foster",
      severity: "medium",
      status: "ongoing",
      evidenceCount: 4,
      timelineEntries: 5,
      crossReferences: 0,
      createdAt: "2024-12-20",
      description: "Reports of inadequate medical care for foster animals"
    }
  ];

  const filteredIncidents = mockIncidents.filter(incident => 
    incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "secondary";
      case "confirmed": return "destructive";
      case "blacklisted": return "destructive";
      case "resolved": return "default";
      case "ongoing": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Documentation System</h1>
          <p className="text-gray-600 mt-1">Advanced incident tracking with evidence, timelines, and cross-references</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Incident
        </Button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Evidence Upload</h3>
                <p className="text-sm text-gray-600">Photos, videos, documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Timeline Builder</h3>
                <p className="text-sm text-gray-600">Chronological incident tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Cross-References</h3>
                <p className="text-sm text-gray-600">Link related incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Data Analytics</h3>
                <p className="text-sm text-gray-600">Pattern recognition</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{mockIncidents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Cases</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockIncidents.filter(i => i.severity === "critical").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidence Files</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockIncidents.reduce((sum, i) => sum + i.evidenceCount, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Timeline Entries</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockIncidents.reduce((sum, i) => sum + i.timelineEntries, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? "Try adjusting your search criteria." : "Create your first incident to get started."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      <Badge variant={getSeverityColor(incident.severity) as any}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status) as any}>
                        {incident.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{incident.description}</p>
                    <p className="text-gray-500 text-sm">Created: {incident.createdAt}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/incidents/${incident.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Enhanced Documentation Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Image className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{incident.evidenceCount}</span>
                    <span className="text-xs text-gray-600">Evidence Files</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{incident.timelineEntries}</span>
                    <span className="text-xs text-gray-600">Timeline Entries</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">{incident.crossReferences}</span>
                    <span className="text-xs text-gray-600">Cross-References</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}