import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import type { ProjectFilters } from "@shared/project-types";

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function ProjectFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  searchQuery 
}: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const specialties = [
    'Gastroenterology',
    'Cardiology',
    'Oncology',
    'Endocrinology',
    'Pulmonology',
    'Nephrology',
    'Neurology',
    'Psychiatry',
    'Surgery',
    'Emergency Medicine',
    'Internal Medicine',
    'Pediatrics'
  ];

  const projectTypes = [
    'meta-analysis',
    'systematic-review',
    'original-research',
    'survey'
  ];

  const difficultyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const timeCommitments = [
    '1-5 hours/week',
    '5-10 hours/week',
    '10-15 hours/week',
    '15+ hours/week'
  ];

  const statuses = [
    'accepting-mentees',
    'active',
    'recruiting',
    'completed'
  ];

  const handleFilterChange = (key: keyof ProjectFilters, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSearch('');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value
    ).length;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Projects
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects by title, mentor, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-6">
            {/* Quick Filters */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.status?.includes('accepting-mentees') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('status', 'accepting-mentees', !filters.status?.includes('accepting-mentees'))}
                >
                  Accepting Mentees
                </Button>
                <Button
                  variant={filters.difficultyLevel?.includes('Beginner') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('difficultyLevel', 'Beginner', !filters.difficultyLevel?.includes('Beginner'))}
                >
                  Beginner Friendly
                </Button>
                <Button
                  variant={filters.projectType?.includes('meta-analysis') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('projectType', 'meta-analysis', !filters.projectType?.includes('meta-analysis'))}
                >
                  Meta-Analysis
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Specialty Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Specialty</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={filters.specialty?.includes(specialty) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('specialty', specialty, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`specialty-${specialty}`}
                        className="text-sm cursor-pointer"
                      >
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Type Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Project Type</Label>
                <div className="space-y-2">
                  {projectTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.projectType?.includes(type) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('projectType', type, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer"
                      >
                        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={filters.difficultyLevel?.includes(level) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('difficultyLevel', level, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`level-${level}`}
                        className="text-sm cursor-pointer"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Commitment Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Time Commitment</Label>
                <div className="space-y-2">
                  {timeCommitments.map((commitment) => (
                    <div key={commitment} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${commitment}`}
                        checked={filters.timeCommitment?.includes(commitment) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('timeCommitment', commitment, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`time-${commitment}`}
                        className="text-sm cursor-pointer"
                      >
                        {commitment}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Project Status</Label>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status?.includes(status) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('status', status, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`status-${status}`}
                        className="text-sm cursor-pointer"
                      >
                        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor/Institution Search */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Mentor/Institution</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Search by mentor name..."
                    value={filters.mentorName || ''}
                    onChange={(e) => onFiltersChange({ ...filters, mentorName: e.target.value || undefined })}
                  />
                  <Input
                    placeholder="Search by institution..."
                    value={filters.institution || ''}
                    onChange={(e) => onFiltersChange({ ...filters, institution: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}