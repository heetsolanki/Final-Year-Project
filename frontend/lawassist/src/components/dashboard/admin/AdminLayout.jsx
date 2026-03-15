const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center overflow-x-hidden">
      <div className="flex-1 w-full px-4 md:px-8 py-8 md:py-10">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
