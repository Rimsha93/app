import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  GraduationCap, 
  ArrowLeft,
  MapPin,
  Wallet,
  CheckCircle2,
  Lock,
  Unlock,
  Plus,
  Minus,
  Star,
  AlertTriangle,
  Info,
  Crosshair
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { University, UniversityCategory } from '@/types';
import { universities } from '@/data/universities';
import { toast } from 'sonner';

export default function Universities() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { shortlistedUniversities, lockedUniversity } = state;
  const [selectedCategory, setSelectedCategory] = useState<UniversityCategory | 'all'>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const filteredUniversities = selectedCategory === 'all' 
    ? universities 
    : universities.filter(u => u.category === selectedCategory);

  const isShortlisted = (uniId: string) => shortlistedUniversities.some(u => u.id === uniId);

  const handleShortlist = (uni: University) => {
    if (isShortlisted(uni.id)) {
      dispatch({ type: 'REMOVE_SHORTLIST', payload: uni.id });
      toast.success(`Removed ${uni.name} from shortlist`);
    } else {
      dispatch({ type: 'SHORTLIST_UNIVERSITY', payload: uni });
      toast.success(`Added ${uni.name} to shortlist`);
    }
  };

  const handleLock = (uni: University) => {
    setSelectedUniversity(uni);
    setShowLockDialog(true);
  };

  const confirmLock = () => {
    if (selectedUniversity) {
      dispatch({ type: 'LOCK_UNIVERSITY', payload: selectedUniversity });
      toast.success(`${selectedUniversity.name} has been locked! Application guidance is now available.`);
      setShowLockDialog(false);
      setSelectedUniversity(null);
    }
  };

  const handleUnlock = () => {
    setShowUnlockDialog(true);
  };

  const confirmUnlock = () => {
    dispatch({ type: 'UNLOCK_UNIVERSITY' });
    toast.success('University unlocked. You can now select a different one.');
    setShowUnlockDialog(false);
  };

  const getCategoryColor = (category: UniversityCategory) => {
    switch (category) {
      case 'dream': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'target': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'safe': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
    }
  };

  const getAcceptanceColor = (chance: string) => {
    switch (chance) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Universities</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {shortlistedUniversities.length} Shortlisted
              </Badge>
              {lockedUniversity && (
                <Badge className="bg-green-100 text-green-700 hidden sm:flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  1 Locked
                </Badge>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover Your Perfect Universities
          </h1>
          <p className="text-slate-600">
            Explore Dream, Target, and Safe universities matched to your profile
          </p>
        </div>

        {/* Locked University Banner */}
        {lockedUniversity && (
          <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">LOCKED</Badge>
                      <span className="text-sm text-green-600">Your committed choice</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{lockedUniversity.name}</h2>
                    <p className="text-slate-600">{lockedUniversity.country} • {lockedUniversity.programs[0]}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleUnlock}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Universities
          </Button>
          <Button
            variant={selectedCategory === 'dream' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('dream')}
            className={selectedCategory === 'dream' ? 'bg-purple-600' : ''}
          >
            <Star className="w-4 h-4 mr-1" />
            Dream
          </Button>
          <Button
            variant={selectedCategory === 'target' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('target')}
            className={selectedCategory === 'target' ? 'bg-blue-600' : ''}
          >
            <Crosshair className="w-4 h-4 mr-1" />
            Target
          </Button>
          <Button
            variant={selectedCategory === 'safe' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('safe')}
            className={selectedCategory === 'safe' ? 'bg-green-600' : ''}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Safe
          </Button>
        </div>

        {/* University Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map(uni => (
            <Card key={uni.id} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div 
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${uni.image})` }}
              />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge className={getCategoryColor(uni.category)}>
                      {uni.category.charAt(0).toUpperCase() + uni.category.slice(1)}
                    </Badge>
                    <h3 className="font-bold text-slate-900 mt-2 line-clamp-1">{uni.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">#{uni.ranking}</p>
                    <p className="text-xs text-slate-500">Ranking</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {uni.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    ${(uni.totalCost / 1000).toFixed(0)}k/yr
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Acceptance</span>
                    <Badge className={getAcceptanceColor(uni.acceptanceChance)}>
                      {uni.acceptanceChance.charAt(0).toUpperCase() + uni.acceptanceChance.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Risk Level</span>
                    <span className={`font-medium ${getRiskColor(uni.riskLevel)}`}>
                      {uni.riskLevel.charAt(0).toUpperCase() + uni.riskLevel.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg mb-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">Why it fits:</span> {uni.whyFit}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isShortlisted(uni.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleShortlist(uni)}
                    className="flex-1"
                    disabled={lockedUniversity?.id === uni.id}
                  >
                    {isShortlisted(uni.id) ? (
                      <>
                        <Minus className="w-4 h-4 mr-1" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Shortlist
                      </>
                    )}
                  </Button>
                  {isShortlisted(uni.id) && !lockedUniversity && (
                    <Button
                      size="sm"
                      onClick={() => handleLock(uni)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Lock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lock Confirmation Dialog */}
      <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Lock University
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to lock <strong>{selectedUniversity?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-sm text-amber-700">
                  Locking a university will unlock application guidance specific to this institution. 
                  You can unlock it later if needed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLockDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLock} className="bg-green-600 hover:bg-green-700">
              <Lock className="w-4 h-4 mr-2" />
              Confirm Lock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlock Confirmation Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-red-600" />
              Unlock University
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to unlock <strong>{lockedUniversity?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Warning</p>
                <p className="text-sm text-red-700">
                  Unlocking will remove your application tasks and guidance. 
                  You'll need to lock another university to access application guidance again.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnlockDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUnlock} variant="destructive">
              <Unlock className="w-4 h-4 mr-2" />
              Confirm Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
