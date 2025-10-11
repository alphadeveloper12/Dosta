const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-white px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[120px] sm:text-[180px] md:text-[220px] font-[700] text-primary/10 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[40px] sm:leading-[48px] md:leading-[56px] font-[700] -tracking-[0.1px] text-primary mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[26px] md:leading-[28px] font-[600] -tracking-[0.1px] text-neutral-gray-dark mb-8 px-4">
          The page you're looking for seems to have gone on a food break. Let's get you back to something delicious!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/"
            className="w-full sm:w-auto bg-primary text-primary-foreground font-[700] text-[14px] leading-[20px] tracking-[0.3px] py-[12px] px-[24px] rounded-[8px] hover:opacity-90 transition-opacity inline-flex items-center justify-center">
            Back to Home
          </a>
          
          <a
            href="/catering"
            className="w-full sm:w-auto bg-neutral-white border-2 border-primary text-primary font-[700] text-[14px] leading-[20px] tracking-[0.3px] py-[12px] px-[24px] rounded-[8px] hover:bg-primary/5 transition-colors inline-flex items-center justify-center">
            Browse Catering
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-4 opacity-20">
          <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <svg className="w-12 h-12 text-[#FF5C60]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
          </svg>
          <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-[14px] leading-[20px] font-[400] tracking-[0.1px] text-neutral-gray-dark">
          Need help? <a href="/contact" className="text-[#8C3EEE] hover:underline font-[600]">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;