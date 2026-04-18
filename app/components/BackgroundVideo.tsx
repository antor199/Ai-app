const BackgroundVideo = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-60 mix-blend-screen"
      >
        <source src="/videos/galaxy.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-deep-gradient opacity-80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default BackgroundVideo;
