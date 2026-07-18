"use client";

import DynamicIcon from "./DynamicIcon";
import styles from "./Skills.module.css";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  icon: string;
}

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  // Define categories to preserve specific order
  const categories = ["Languages", "Frameworks & Libraries", "Databases & Tools"];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Fallback if no skills are loaded
  if (skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>02.</span> Technical Stack
        </h2>

        <div className={styles.grid}>
          {categories.map((category) => {
            const categorySkills = groupedSkills[category] || [];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className={styles.categoryCard}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.skillList}>
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className={styles.skillItem}>
                      <div className={styles.skillInfo}>
                        <span className={styles.skillIcon}>
                          <DynamicIcon name={skill.icon} size={16} />
                        </span>
                        <span className={styles.skillName}>{skill.name}</span>
                      </div>
                      <span className={styles.skillBadge}>{skill.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
