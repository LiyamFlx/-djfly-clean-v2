import { useEffect } from 'react';
import { useAIActions, useAIState, useAudioActions } from '@/store';
import { SavedSet } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchSavedSets } = useAIActions();
  const { savedSets } = useAIState();
  const { setQueue } = useAudioActions();

  useEffect(() => {
    fetchSavedSets();
  }, [fetchSavedSets]);

  const handleLoadSet = (set: SavedSet) => {
    setQueue(set.tracks);
    navigate(ROUTES.PLAYER);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold gradient-text mb-8">Library</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedSets.map((set) => (
            <Card key={set.id}>
              <CardHeader>
                <CardTitle>{set.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{set.tracks.length} tracks</p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => handleLoadSet(set)}>Load</Button>
                  <Button variant="destructive" onClick={() => deleteSet(set.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;