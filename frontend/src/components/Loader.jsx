import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="animate-spin text-blue-600" size={48} />
  </div>
);

export default Loader;
