import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary mt-auto w-full border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap w-full max-w-[1280px] mx-auto">
        <div className="col-span-1 md:col-span-1">
          <span className="font-headline-md text-headline-md text-secondary-fixed block mb-6">
            GoThailand
          </span>
          <p className="font-body-md text-body-md text-on-primary/80">
            © 2024 GoThailand Luxury Travel. All rights reserved.
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-wider">
            Company
          </h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">About Us</a></li>
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">Sustainability</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-wider">
            Legal
          </h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-wider">
            Connect
          </h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">Press Kit</a></li>
            <li><a className="text-on-primary/80 hover:text-on-primary transition-colors" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
