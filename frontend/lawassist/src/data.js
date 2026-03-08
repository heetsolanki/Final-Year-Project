import {
  Scale,
  Shield,
  FileText,
  Users,
  MessageSquare,
  Search,
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  Upload,
  Gavel,
  ShoppingCart,
  Landmark,
  Package,
  ShieldCheck,
  Building,
  Lightbulb,
  Eye,
  Lock,
  Activity,
  Utensils,
  Pill,
  Tag,
  Wifi,
} from "lucide-react";

// Expert Profile Data
export const specializations = [
  "Consumer Law",
  "Cyber Law",
  "Banking Law",
  "Insurance Law",
  "Corporate Law",
  "Family Law",
  "Other",
];

export const expertiseOptions = [
  "Consumer Protection",
  "Online Shopping Fraud",
  "Banking Complaints",
  "Insurance Claims",
  "Defective Products",
  "E-commerce Disputes",
  "Service Deficiency",
  "Cyber Fraud",
];

export const indianLanguages = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Bengali",
];

export const states = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Tirupati",
    "Kurnool",
    "Rajahmundry",
  ],

  "Arunachal Pradesh": [
    "Itanagar",
    "Tawang",
    "Pasighat",
    "Ziro",
    "Bomdila",
    "Roing",
    "Tezu",
  ],

  Assam: [
    "Guwahati",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
    "Tezpur",
    "Nagaon",
    "Tinsukia",
  ],

  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Darbhanga",
    "Purnia",
    "Bihar Sharif",
  ],

  Chhattisgarh: [
    "Raipur",
    "Bilaspur",
    "Durg",
    "Bhilai",
    "Korba",
    "Rajnandgaon",
    "Jagdalpur",
  ],

  Goa: [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Bicholim",
    "Curchorem",
  ],

  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
  ],

  Haryana: [
    "Gurgaon",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Rohtak",
    "Hisar",
    "Karnal",
  ],

  "Himachal Pradesh": [
    "Shimla",
    "Manali",
    "Dharamshala",
    "Solan",
    "Mandi",
    "Kullu",
    "Hamirpur",
  ],

  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
    "Giridih",
  ],

  Karnataka: [
    "Bangalore",
    "Mysore",
    "Mangalore",
    "Hubli",
    "Belgaum",
    "Davangere",
    "Shimoga",
  ],

  Kerala: [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
    "Kannur",
    "Alappuzha",
    "Kollam",
  ],

  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Sagar",
    "Satna",
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Aurangabad",
    "Kolhapur",
  ],

  Manipur: [
    "Imphal",
    "Thoubal",
    "Bishnupur",
    "Churachandpur",
    "Ukhrul",
    "Kakching",
    "Senapati",
  ],

  Meghalaya: [
    "Shillong",
    "Tura",
    "Nongpoh",
    "Jowai",
    "Baghmara",
    "Williamnagar",
    "Resubelpara",
  ],

  Mizoram: [
    "Aizawl",
    "Lunglei",
    "Champhai",
    "Serchhip",
    "Kolasib",
    "Saiha",
    "Lawngtlai",
  ],

  Nagaland: [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Mon",
    "Phek",
  ],

  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Sambalpur",
    "Berhampur",
    "Balasore",
    "Puri",
  ],

  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Chandigarh",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
  ],

  Rajasthan: [
    "Jaipur",
    "Udaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Alwar",
  ],

  Sikkim: [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Rangpo",
    "Singtam",
    "Jorethang",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
    "Tirunelveli",
    "Erode",
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Ramagundam",
    "Mahbubnagar",
  ],

  Tripura: [
    "Agartala",
    "Udaipur",
    "Dharmanagar",
    "Kailasahar",
    "Belonia",
    "Ambassa",
    "Khowai",
  ],

  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Noida",
    "Varanasi",
    "Agra",
    "Ghaziabad",
    "Meerut",
  ],

  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Rishikesh",
    "Haldwani",
    "Roorkee",
    "Kashipur",
  ],

  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Siliguri",
    "Asansol",
    "Kharagpur",
    "Haldia",
  ],
};

// Query Categories

export const categories = [
  "Banking",
  "E-Commerce",
  "Insurance",
  "Real Estate",
  "Telecom",
  "Travel",
  "Education",
  "Medical",
  "Others",
];

// Home Page Data

export const miniCards = [
  {
    id: 1,
    icon: <Scale size={30} />,
    title: "Justice",
  },
  {
    id: 2,
    icon: <Shield size={30} />,
    title: "Protection",
  },
  {
    id: 3,
    icon: <FileText size={30} />,
    title: "Documents",
  },
  {
    id: 4,
    icon: <Users size={30} />,
    title: "Experts",
  },
];

export const features = [
  {
    id: 1,
    icon: <MessageSquare size={22} />,
    title: "Submit Legal Query",
    text: "Easily submit your consumer complaints and legal questions through our streamlined form.",
  },
  {
    id: 2,
    icon: <Upload size={22} />,
    title: "Upload Documents",
    text: "Easily upload and manage your legal documents securely.",
  },
  {
    id: 3,
    icon: <ShieldCheck size={22} />,
    title: "Secure Storage",
    text: "All your documents are securely stored and protected.",
  },
  {
    id: 4,
    icon: <Search size={22} />,
    title: "Search Legal Resources",
    text: "Find relevant legal resources and information quickly.",
  },
  {
    id: 5,
    icon: <LayoutDashboard size={22} />,
    title: "Dashboard Overview",
    text: "View your legal queries and documents in one centralized dashboard.",
  },
  {
    id: 6,
    icon: <ClipboardList size={22} />,
    title: "Track Legal Progress",
    text: "Monitor the status of your legal queries and documents.",
  },
];

export const steps = [
  {
    id: 1,
    icon: <UserPlus size={22} />,
    title: "Register / Login",
    text: "Create your secure account to get started with LawAssist.",
  },
  {
    id: 2,
    icon: <FileText size={22} />,
    title: "Submit Complaint",
    text: "Describe your consumer issue using our guided query form.",
  },
  {
    id: 3,
    icon: <Upload size={22} />,
    title: "Upload Documents",
    text: "Attach supporting evidence like receipts and contracts.",
  },
  {
    id: 4,
    icon: <Gavel size={22} />,
    title: "Get Expert Guidance",
    text: "Receive personalized legal advice from verified experts.",
  },
];

export const homeCategories = [
  {
    id: 1,
    icon: <ShoppingCart size={22} />,
    title: "E-commerce & Online Shopping",
    text: "Disputes with online purchases, refunds, and delivery issues.",
  },
  {
    id: 2,
    icon: <Landmark size={22} />,
    title: "Banking & Financial Issues",
    text: "Unfair charges, loan disputes, and financial fraud complaints.",
  },
  {
    id: 3,
    icon: <Package size={22} />,
    title: "Product Defects",
    text: "Manufacturing defects, warranty claims, and faulty goods.",
  },
  {
    id: 4,
    icon: <ShieldCheck size={22} />,
    title: "Insurance Complaints",
    text: "Claim rejections, delays, and unfair policy practices.",
  },
  {
    id: 5,
    icon: <Building size={22} />,
    title: "Real Estate Issues",
    text: "Property disputes, builder defaults, and tenant rights.",
  },
];

// Registration Steps Data

export const consumerPoints = [
  "Access verified consumer rights guidance.",
  "Track and manage your legal queries.",
  "Connect with trusted legal professionals.",
  "Stay updated with consumer law resources.",
];

export const expertPoints = [
  "Expand your professional visibility.",
  "Receive verified legal consultation requests.",
  "Build credibility through verified profile.",
  "Manage client queries efficiently.",
];

export const missions = [
  {
    id: 1,
    icon: <Lightbulb />,
    title: "Simplify Legal Access",
    text: "Break down complex legal processes into simple, actionable steps for every consumer.",
  },
  {
    id: 2,
    icon: <Eye />,
    title: "Increase Consumer Awareness",
    text: "Educate users about their fundamental rights through accessible resources and guidance.",
  },
  {
    id: 3,
    icon: <ClipboardList />,
    title: "Structured Query Management",
    text: "Provide an organized system to submit, track, and resolve legal queries efficiently.",
  },
  {
    id: 4,
    icon: <Lock />,
    title: "Secure Document Handling",
    text: "Ensure all uploaded documents and personal data are handled with industry-grade security.",
  },
];

export const offers = [
  {
    id: 1,
    icon: <Shield />,
    title: "Secure User Accounts",
    text: "Protected sign-up and login with encrypted credentials.",
  },
  {
    id: 2,
    icon: <MessageSquare />,
    title: "Submit Legal Queries",
    text: "Easy-to-use form to describe your consumer complaint.",
  },
  {
    id: 3,
    icon: <Upload />,
    title: "Upload Supporting Documents",
    text: "Attach invoices, receipts, and evidence securely.",
  },
  {
    id: 4,
    icon: <Activity />,
    title: "Track Query Status",
    text: "Real-time updates on the progress of your complaint.",
  },
  {
    id: 5,
    icon: <Users />,
    title: "Expert Panel Access",
    text: "Connect with verified legal professionals for guidance.",
  },
  {
    id: 6,
    icon: <Search />,
    title: "Smart Legal Search",
    text: "Search consumer laws, acts, and legal precedents instantly.",
  },
];

export const getStatusClass = (status) => {
  switch (status) {
    case "In Review":
      return "user-status-pending";
    case "Answered":
      return "user-status-answered";
    case "Assigned":
      return "user-status-consult";
    case "Resolved":
      return "user-status-resolved";
    default:
      return "user-status-default";
  }
};

export const iconMap = {
  "Shopping & Product Problems": <ShoppingCart size={30} />,
  "Online Shopping Problems": <Wifi size={30} />,
  "Food & Restaurant Safety": <Utensils size={30} />,
  "MRP & Pricing Problems": <Tag size={30} />,
  "Medicine & Pharmacy Safety": <Pill size={30} />,
  "Online Fraud & Cyber Scams": <ShieldCheck size={30} />,
};
