import { ChangeEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import {useLocalstorageState } from 'rooks';
import Container from '@mui/material/Container'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LinkIcon from '@mui/icons-material/Link'

import { Carousel } from '../components/carousel';
import { PokemonCard } from '../components/pokemoncard';
import { getPokemon, Member, Pokemon } from '../lib/pokemon';
import { shuffle } from '../lib/util';

//import styles from '../styles/Home.module.css'

// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png
// https://www.publicdomainpictures.net/pictures/30000/velka/solid-red-background.jpg



const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  //bgcolor: 'background.paper',
  //border: '2px solid #000',
  //boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [open, setOpen] = useState(false)
  const [nationalDex, setNationalDex] = useState<Pokemon[]>([]);
  const [memberPool, setMemberPool] = useLocalstorageState<Member[]>('pokemon_member_pool', []);
  // drafting members
  const [draftedMember, setDraftedMember] = useState<string>('');
  const [draftedNickname, setDraftedNickname] = useState<string>('');
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  // generating teams
  const [team, setTeam] = useState<Member[]>([]);
  const [teamSize, setTeamSize] = useLocalstorageState<number>('pokemon_team_size', 6);

  const handleDraftedMemberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftedMember(event.target.value);
    setConfirmDisabled(nationalDex.findIndex(e => e.name === event.target.value.toLocaleLowerCase()) === -1);
  };

  const handleDraftedMemberConfirmation = () => {
    // check that member exists
    const memberIndex = nationalDex.findIndex(e => e.name === draftedMember.toLocaleLowerCase());
    if(memberIndex > -1) {
      setConfirmDisabled(true);
      setDraftedMember('');
      setDraftedNickname('');
      setMemberPool(e => [...e, {
        uuid: uuidv4(),
        nickname: draftedNickname,
        ...nationalDex[memberIndex]
      }])
      setOpen(false)
    }
  };

  const handleMemberDelete = (uuid: string) => {
    //console.log('delete?', uuid)
    setMemberPool(value => value.filter(e => e.uuid !== uuid));
    setTeam(value => value.filter(e => e.uuid !== uuid));
  }

  const handleTeamGenerate = () => {
    let temp = teamSize;
    if(isNaN(temp)) {
      setTeamSize(6);
      temp = 6;
    }
    setTeam(() => shuffle(memberPool.slice()).slice(0, temp))
  };
  
  useEffect(() => {
    getPokemon().then(value => setNationalDex(value))
  }, []);

  return (
    <div>
      <Head>
        <title>BDSP Randomizer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg" >
        <main>
          <h1>BDSP Randomizer</h1>
          <Button href="https://github.com/au5ton/bdsp-randomizer" variant="contained" startIcon={<LinkIcon />}>
            Source Code
          </Button>

          <h2>Generated Team</h2>
          <Button variant="contained" onClick={handleTeamGenerate}>Regenerate</Button>
          <br />
          <label>
            Enter Team Size:
            <input type="number" value={teamSize} onChange={e => { if(!isNaN(e.target.valueAsNumber)) setTeamSize(e.target.valueAsNumber) }} />
          </label>
          <Carousel>
            { team.map(e => <PokemonCard key={e.uuid} data={e} /> )}
          </Carousel>

          <h2>Member Pool</h2>
          <Button variant="contained" onClick={() => setOpen(v => !v)}>Add Member</Button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Paper sx={modalStyle}>
              <datalist id="national_dex">
                { nationalDex.map(e => <option key={e.name} value={e.name} /> )}
              </datalist>
              <Stack spacing={2}>
                <Typography variant="h5" component="h2">
                  Add a Team Member
                </Typography>
                <label>
                  Choose a Pokemon:
                  <input value={draftedMember} onChange={handleDraftedMemberChange} list="national_dex" style={{ textTransform: 'capitalize' }} />
                </label>
                <label>
                  Give a nickname (optional):
                  <input value={draftedNickname} onChange={e => setDraftedNickname(e.target.value)} />
                </label>
                <Button variant="contained" disabled={confirmDisabled} onClick={handleDraftedMemberConfirmation}>Confirm</Button>
              </Stack>
            </Paper>
          </Modal>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ margin: 0 }}
          >
            { memberPool.map(e => 
              <Grid item key={e.uuid}>
                <PokemonCard key={e.uuid} data={e} onDelete={handleMemberDelete} showDeleteButton />
              </Grid>
            )}
            {/* <PokemonCard showDeleteButton name="Fletchinder" imageUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png" /> */}
          </Grid>
        </main>
      </Container>
    </div>
  )
}
