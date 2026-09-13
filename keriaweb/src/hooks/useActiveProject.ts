'use client';

import { useState, useEffect } from 'react';

export interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export function useActiveProject() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchActiveProject() {
      try {
        setLoading(true);
        const res = await fetch('/api/projects/active');
        if (!res.ok) {
          throw new Error('Chưa có dự án kích hoạt');
        }
        const data = await res.json();
        if (isMounted) {
          setActiveProject(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchActiveProject();

    return () => {
      isMounted = false;
    };
  }, []);

  return { activeProject, loading, error };
}