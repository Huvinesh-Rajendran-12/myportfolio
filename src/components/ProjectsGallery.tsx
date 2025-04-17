'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/types/portfolio';
import ProjectCard from './ProjectCard';
import styles from './ProjectsGallery.module.css';

interface ProjectsGalleryProps {
  projects: Project[];
  className?: string;
}

// Filter categories for projects
type FilterCategory = 'all' | 'featured' | 'completed' | 'in-progress' | 'planned';

const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ projects, className }) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState<string[]>([]);
  
  // Get unique technologies from all projects
  const allTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        techSet.add(tech);
      });
    });
    return Array.from(techSet).sort();
  }, [projects]);
  
  // Filter projects based on current filters
  useEffect(() => {
    let filtered = [...projects];
    
    // Apply status filter
    if (filter === 'featured') {
      filtered = filtered.filter(project => project.featured);
    } else if (filter !== 'all') {
      filtered = filtered.filter(project => project.status === filter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)
      );
    }
    
    // Apply technology filter
    if (techFilter.length > 0) {
      filtered = filtered.filter(project => 
        techFilter.some(tech => project.technologies.includes(tech))
      );
    }
    
    // Sort by year (newest first) and featured status
    filtered.sort((a, b) => {
      // Put featured projects first if in featured view
      if (filter === 'featured' && a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      // Otherwise sort by year (newest first)
      return b.year - a.year;
    });
    
    setVisibleProjects(filtered);
  }, [filter, projects, searchTerm, techFilter]);
  
  // Toggle tech filter
  const toggleTechFilter = (tech: string) => {
    setTechFilter(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setTechFilter([]);
  };
  
  return (
    <div className={`${styles.projectsGallery} ${className || ''}`}>
      <div className={styles.galleryControls}>
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`} 
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All
          </button>
          <button 
            className={`${styles.filterTab} ${filter === 'featured' ? styles.active : ''}`} 
            onClick={() => setFilter('featured')}
            aria-pressed={filter === 'featured'}
          >
            Featured
          </button>
          <button 
            className={`${styles.filterTab} ${filter === 'completed' ? styles.active : ''}`} 
            onClick={() => setFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            Completed
          </button>
          <button 
            className={`${styles.filterTab} ${filter === 'in-progress' ? styles.active : ''}`} 
            onClick={() => setFilter('in-progress')}
            aria-pressed={filter === 'in-progress'}
          >
            In Progress
          </button>
        </div>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            aria-label="Search projects"
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch} 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {techFilter.length > 0 && (
        <div className={styles.activeTechFilters}>
          <span className={styles.filterLabel}>Tech Filters:</span>
          {techFilter.map(tech => (
            <span key={tech} className={styles.activeTechTag}>
              {tech}
              <button 
                className={styles.removeTech} 
                onClick={() => toggleTechFilter(tech)}
                aria-label={`Remove ${tech} filter`}
              >
                ×
              </button>
            </span>
          ))}
          <button 
            className={styles.clearTechFilters} 
            onClick={() => setTechFilter([])}
            aria-label="Clear all tech filters"
          >
            Clear All
          </button>
        </div>
      )}
      
      <div className={styles.techFilters}>
        <div className={styles.techFilterLabel}>Filter by Tech:</div>
        <div className={styles.techTagsContainer}>
          {allTechnologies.map(tech => (
            <button
              key={tech}
              className={`${styles.techFilterTag} ${techFilter.includes(tech) ? styles.activeTech : ''}`}
              onClick={() => toggleTechFilter(tech)}
              aria-pressed={techFilter.includes(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      
      {visibleProjects.length === 0 ? (
        <div className={styles.noResults}>
          <p>No projects match your filters</p>
          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={styles.projectsGrid}>
          {visibleProjects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} />
          ))}
        </div>
      )}
      
      <div className={styles.projectCount}>
        Showing {visibleProjects.length} of {projects.length} projects
      </div>
    </div>
  );
};

export default ProjectsGallery;