'use client';

import React, { useState } from 'react';
import { Project } from '@/types/portfolio';
import { soundEffects } from '@/utils/SoundEffects';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Status badges
  const getStatusBadge = () => {
    if (!project.status) return null;
    
    const statusClasses = {
      'completed': styles.statusCompleted,
      'in-progress': styles.statusInProgress,
      'planned': styles.statusPlanned,
      'archived': styles.statusArchived
    };
    
    const statusLabels = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'planned': 'Planned',
      'archived': 'Archived'
    };
    
    const statusClass = statusClasses[project.status] || '';
    const statusLabel = statusLabels[project.status] || project.status;
    
    return (
      <span className={`${styles.statusBadge} ${statusClass}`}>{statusLabel}</span>
    );
  };
  
  // Handle mouse interactions
  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEffects.play('navigate', 0.2);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div 
      className={`${styles.projectCard} ${className || ''} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-labelledby={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className={styles.projectHeader}>
        <h3 
          id={`project-title-${project.title.replace(/\s+/g, '-').toLowerCase()}`}
          className={styles.projectTitle}
        >
          {project.title}
          {project.isPrivate && <span className={styles.privateLabel}>PRIVATE</span>}
        </h3>
        {getStatusBadge()}
      </div>
      
      <div className={styles.projectYear}>{project.year}</div>
      
      <p className={styles.projectDescription}>{project.description}</p>
      
      <div className={styles.projectTech}>
        {project.technologies.map((tech, index) => (
          <span key={index} className={styles.techTag}>
            {tech}
          </span>
        ))}
      </div>
      
      <div className={styles.projectLink}>
        {project.isPrivate ? (
          <span className={styles.privateInfo}>{project.linkText} (Private project)</span>
        ) : (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.projectLinkButton}
            aria-label={`Visit ${project.linkText} (opens in a new tab)`}
          >
            <span>{project.linkText}</span>
            <span className={styles.linkArrow}>➔</span>
          </a>
        )}
      </div>
      
      {isHovered && (
        <div className={styles.cardGlow} aria-hidden="true"></div>
      )}
    </div>
  );
};

export default ProjectCard;