import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Member, Pokemon } from '../lib/pokemon';

export interface PokemonCardProps {
  data: Member;
  showDeleteButton?: boolean;
  onDelete?: (uuid: string) => void;
}

export function PokemonCard({ data: { name, nickname, imageUrl, uuid }, showDeleteButton, onDelete }: PokemonCardProps) {
  return (
    <Paper sx={{ flexShrink: 0, padding: '10px' }}>
      <Stack spacing={1}>
        <img
            width="120"
            height="120"
            src={imageUrl}
            alt={name}
            style={{
              marginBottom: 0
            }}
          />
        <div>
          <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 'bold', textAlign: 'center', lineHeight: 1 }} color="text.secondary">
            {name}
          </Typography>
          { nickname && nickname !== '' ? 
            <Typography sx={{ fontSize: 12, textAlign: 'center' }} color="text.secondary">
              {nickname}
            </Typography>
           : null}
        </div>
        { showDeleteButton ? <Button variant="text" color="error" size="small" onClick={() => { if(onDelete) onDelete(uuid) }}>Delete</Button> : null }
      </Stack>
    </Paper>
  );
}
