import React from 'react';

const steps = [
  {
    icon: 'mail',
    stepNumber: '01',
    title: 'Check Your Email',
    description: 'Review your detailed itinerary and receipt.'
  },
  {
    icon: 'description',
    stepNumber: '02',
    title: 'Prepare Documents',
    description: "Have your driver's license and passport ready."
  },
  {
    icon: 'car_rental',
    stepNumber: '03',
    title: 'Pick Up Your Car',
    description: 'Arrive at the designated pickup point.'
  }
];

export default function NextStepsBento() {
  return (
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter w-full mb-section-gap">
      {steps.map((step) => (
        <div 
          key={step.stepNumber}
          class="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/20 shadow-[0px_12px_32px_rgba(0,51,102,0.02)] flex flex-col items-center text-center hover:border-outline-variant/50 transition-colors"
        >
          <span 
            class="material-symbols-outlined text-3xl text-secondary-fixed-dim mb-4" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {step.icon}
          </span>
          <h3 class="font-label-md text-label-md text-primary mb-2">
            {step.stepNumber} {step.title}
          </h3>
          <p class="font-body-md text-body-md text-on-surface-variant text-sm">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
