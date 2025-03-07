const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

export default Modal; 