import React from 'react';
import CVBuilderClient from './components/CVBuilderClient';

export default function CVBuilderPage() {
  return (
    <div className="min-h-screen bg-background">

      <main className="pt-20">
        <CVBuilderClient />
      </main>
    </div>
  );
}