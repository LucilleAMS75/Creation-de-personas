import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  X, 
  User, 
  CheckCircle, 
  Download, 
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

// --- Types ---
interface PersonaData {
  age: string;
  gender: string;
  seniority: string;
  experienceLevel: string;
  position: string;
  motivation: string;
  needs: string;
  photo: string | null;
}

interface AppState {
  michelle: PersonaData;
  ziang: PersonaData;
}

const INITIAL_PERSONA: PersonaData = {
  age: '',
  gender: '',
  seniority: '',
  experienceLevel: '',
  position: '',
  motivation: '',
  needs: '',
  photo: null,
};

const INITIAL_STATE: AppState = {
  michelle: { ...INITIAL_PERSONA },
  ziang: { ...INITIAL_PERSONA },
};

// --- Components ---

const Section = ({ title, children, defaultOpen = false, icon: Icon }: { title: string, children: React.ReactNode, defaultOpen?: boolean, icon?: any }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-primary/20 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-primary w-5 h-5" />}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-primary" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PersonaCard = ({ 
  name, 
  data, 
  onChange 
}: { 
  name: string, 
  data: PersonaData, 
  onChange: (newData: PersonaData) => void 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof PersonaData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({ ...data, photo: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
            {data.photo ? (
              <img src={data.photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          {data.photo && (
            <button 
              onClick={removePhoto}
              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          <Camera size={14} />
          {data.photo ? "Changer la photo" : "Ajouter une photo"}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoUpload} 
        />
        <h3 className="text-2xl font-bold text-primary mt-2">{name}</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Âge</label>
            <input 
              type="text" 
              placeholder="Ex : 45 ans"
              value={data.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Genre</label>
            <input 
              type="text" 
              placeholder="Ex : Femme"
              value={data.gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Ancienneté</label>
          <input 
            type="text" 
            placeholder="Ex : 10 ans dans l'entreprise"
            value={data.seniority}
            onChange={(e) => handleFieldChange('seniority', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Poste</label>
          <input 
            type="text" 
            placeholder="Ex : Réceptionniste"
            value={data.position}
            onChange={(e) => handleFieldChange('position', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Niveau d'expérience</label>
          <textarea 
            rows={3}
            placeholder="Décrivez le niveau d'expérience..."
            value={data.experienceLevel}
            onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Motivation (ou réticence)</label>
          <textarea 
            rows={4}
            placeholder="Décrivez les motivations ou freins de ce persona..."
            value={data.motivation}
            onChange={(e) => handleFieldChange('motivation', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Besoins</label>
          <textarea 
            rows={4}
            placeholder="Décrivez les besoins, y compris les adaptations liées au handicap le cas échéant..."
            value={data.needs}
            onChange={(e) => handleFieldChange('needs', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('persona_exercise_data');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('persona_exercise_data', JSON.stringify(state));
  }, [state]);

  const handleValidate = () => {
    const allFieldsFilled = (persona: PersonaData) => {
      return Object.entries(persona).every(([key, value]) => {
        if (key === 'photo') return true; // Photo is optional
        return value.trim() !== '';
      });
    };

    if (allFieldsFilled(state.michelle) && allFieldsFilled(state.ziang)) {
      setShowWarning(false);
      setIsModalOpen(true);
    } else {
      setShowWarning(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const generateUserPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('fr-FR');
    
    doc.setFontSize(22);
    doc.setTextColor(147, 102, 228); // #9366E4
    doc.text("Exercice Personas - Mes réponses", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date de réalisation : ${date}`, 20, 30);

    const renderPersona = (name: string, data: PersonaData, startY: number) => {
      doc.setFontSize(18);
      doc.setTextColor(147, 102, 228);
      doc.text(name, 20, startY);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      let currentY = startY + 10;
      const fields = [
        { label: "Âge", value: data.age },
        { label: "Genre", value: data.gender },
        { label: "Ancienneté", value: data.seniority },
        { label: "Poste", value: data.position },
        { label: "Niveau d'expérience", value: data.experienceLevel },
        { label: "Motivation", value: data.motivation },
        { label: "Besoins", value: data.needs },
      ];

      fields.forEach(f => {
        doc.setFont("helvetica", "bold");
        doc.text(`${f.label} :`, 20, currentY);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(f.value, 160);
        doc.text(splitText, 20, currentY + 5);
        currentY += 10 + (splitText.length * 5);
        
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
      });

      return currentY + 10;
    };

    let nextY = renderPersona("Michelle", state.michelle, 45);
    if (nextY > 200) {
      doc.addPage();
      nextY = 20;
    }
    renderPersona("Ziang", state.ziang, nextY);

    doc.save(`Exercice_Personas_Reponses_${date.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a 
            href="https://1001parcours.cci.fr/experience/mod/page/view.php?id=2129" 
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Retour</span>
          </a>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Exercice — Création de Personas</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">CCE « Exercer la mission de formateur en entreprise »</p>
          </div>
          <div className="w-10 sm:w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Consigne Section */}
        <Section title="Consigne" defaultOpen={true} icon={AlertCircle}>
          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="font-medium">
              À partir des informations transmises dans la demande de formation de Résid'Azur, complétez les deux fiches personas ci-dessous. L'un des deux personas devra être porteur du handicap mentionné dans la demande.
            </p>
            <div className="bg-primary/5 border-l-4 border-primary p-4 my-4 rounded-r-lg">
              <p className="text-xs font-bold uppercase text-primary mb-1">Attention :</p>
              <p>Certaines informations ne sont pas explicitement fournies par le commanditaire (notamment la motivation/réticence et les besoins détaillés). Il vous appartient de les imaginer de manière réaliste et cohérente, en vous appuyant sur le contexte donné et votre compréhension du profil des apprenants.</p>
            </div>
            <h4 className="font-bold text-gray-900 mt-6 mb-2">Rappel : qu'est-ce qu'un persona ?</h4>
            <p>
              Un persona est un profil fictif mais réaliste représentant un apprenant type de la formation. Il synthétise les caractéristiques clés du public cible : âge, poste, niveau de compétence, motivations, freins éventuels et besoins spécifiques. Construire un ou plusieurs personas aide le formateur à concevoir une action de formation centrée sur les besoins réels des participants, plutôt que sur des hypothèses abstraites.
            </p>
            <p className="mt-4 font-bold">Personas à compléter : Michelle et Ziang</p>
          </div>
        </Section>

        {/* Contexte Section */}
        <Section title="📋 Demande de formation Résid'Azur" defaultOpen={false}>
          <div className="prose prose-sm max-w-none text-gray-700">
            <h4 className="font-bold text-gray-900 mb-2">Caractéristiques de Résid'Azur :</h4>
            <ul className="space-y-2">
              <li><strong>Groupe :</strong> 180 personnes (20 à 57 ans), 4 résidences (Nice, Marseille, Montpellier, Perpignan).</li>
              <li><strong>Public cible :</strong> 120 collaborateurs (réceptionnistes et responsables de résidence).</li>
              <li><strong>Format :</strong> Présentiel, 2 jours (14h), groupes de 10-12 participants.</li>
              <li><strong>Niveau initial :</strong> Très hétérogène (de 6 mois à 15 ans d'ancienneté). Aucune formation préalable en gestion des conflits.</li>
              <li><strong>Handicap :</strong> Une collaboratrice du site de Marseille est en situation de handicap visuel.</li>
            </ul>
          </div>
        </Section>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <PersonaCard 
            name="Michelle" 
            data={state.michelle} 
            onChange={(newData) => setState({ ...state, michelle: newData })} 
          />
          <PersonaCard 
            name="Ziang" 
            data={state.ziang} 
            onChange={(newData) => setState({ ...state, ziang: newData })} 
          />
        </div>

        {/* Validation Button */}
        <div className="mt-12 flex flex-col items-center gap-4">
          {showWarning && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100"
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Veuillez remplir tous les champs avant de valider.</span>
            </motion.div>
          )}
          <button 
            onClick={handleValidate}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <CheckCircle size={20} />
            Valider mes réponses
          </button>
        </div>
      </main>

      {/* Footer Indicator */}
      <footer className="fixed bottom-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-[10px] font-medium text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          Sauvegarde automatique activée ✓
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-primary p-8 text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold">Bravo !</h3>
                <p className="text-white/80 mt-2">Vous avez terminé l'exercice avec succès.</p>
              </div>
              <div className="p-8 space-y-4">
                <button 
                  onClick={generateUserPDF}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Download size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Télécharger mes réponses</p>
                      <p className="text-xs text-gray-500">Format PDF</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
