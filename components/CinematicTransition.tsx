'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';

type SceneTone = 'home' | 'games' | 'challenges' | 'rankings' | 'achievements' | 'relics' | 'profile' | 'settings' | 'admin' | 'auth';
type SceneEffect = 'awakening' | 'horizon' | 'trial' | 'ascension' | 'archive' | 'wilds' | 'dossier' | 'observatory' | 'council' | 'threshold';
type Scene = { eyebrow:string; title:string; subtitle:string; tone:SceneTone; effect:SceneEffect; symbol:string; chapter:string };

const scenes: Array<[string, Scene]> = [
  ['/admin',{eyebrow:'THE INNER COUNCIL',title:'THE COUNCIL CHAMBER',subtitle:'Iron, ink and authority. The Order opens its most guarded chamber.',tone:'admin',effect:'council',symbol:'◈',chapter:'VII'}],
  ['/games',{eyebrow:'THE KNOWN WORLD',title:'THE TERRITORIES',subtitle:'Ancient horizons emerge through the mist. Every run becomes part of your legend.',tone:'games',effect:'horizon',symbol:'✧',chapter:'II'}],
  ['/challenges',{eyebrow:'ACTIVE TRIALS',title:'THE TRIAL GROUNDS',subtitle:'Steel answers steel. The arena wakes. Your next deed is waiting.',tone:'challenges',effect:'trial',symbol:'⚔',chapter:'III'}],
  ['/rankings',{eyebrow:'THE HIGHEST RECORDS',title:'HALL OF ASCENSION',subtitle:'A silent hall of names. Only deeds carry their weight here.',tone:'rankings',effect:'ascension',symbol:'♜',chapter:'IV'}],
  ['/achievements',{eyebrow:'THE GRAND ARCHIVE',title:'THE DEEDS',subtitle:'Pages turn in the dark. Relics awaken. The Order remembers what was earned.',tone:'achievements',effect:'archive',symbol:'✦',chapter:'V'}],
  ['/my-achievements',{eyebrow:'YOUR PRIVATE VAULT',title:'YOUR RELICS',subtitle:'Living motes drift through the vault. Your collected deeds wait beyond the mist.',tone:'relics',effect:'wilds',symbol:'◇',chapter:'VI'}],
  ['/profile',{eyebrow:'THE RECORD',title:'THE DOSSIER',subtitle:'Ink remembers what memory forgets. A history is a trail of choices.',tone:'profile',effect:'dossier',symbol:'☷',chapter:'I'}],
  ['/settings',{eyebrow:'THE INNER CHAMBER',title:'THE OBSERVATORY',subtitle:'Stars wheel above the instruments. Calibrate the way you enter the Order.',tone:'settings',effect:'observatory',symbol:'◎',chapter:'VIII'}],
  ['/login',{eyebrow:'THE THRESHOLD',title:'RETURN TO THE ORDER',subtitle:'The seal recognizes a familiar hand.',tone:'auth',effect:'threshold',symbol:'∴',chapter:'IX'}],
  ['/signup',{eyebrow:'THE INITIATION',title:'TAKE YOUR PLACE',subtitle:'Every record begins with a first step into the unknown.',tone:'auth',effect:'threshold',symbol:'∴',chapter:'IX'}],
  ['/onboarding',{eyebrow:'THE FIRST ASCENT',title:'THE INITIATION',subtitle:'Choose your path. The Order is waiting to know your name.',tone:'auth',effect:'awakening',symbol:'∴',chapter:'IX'}],
  ['/forgot-password',{eyebrow:'THE LOST SEAL',title:'RECOVER THE RECORD',subtitle:'A quiet chamber. A single seal waiting to be restored.',tone:'auth',effect:'threshold',symbol:'∴',chapter:'IX'}],
  ['/reset-password',{eyebrow:'THE RESTORED SEAL',title:'RECLAIM THE CHAMBER',subtitle:'The lock turns. Your path continues.',tone:'auth',effect:'awakening',symbol:'∴',chapter:'IX'}],
  ['/verify-email',{eyebrow:'THE VERIFICATION CHAMBER',title:'PROVE THE SEAL',subtitle:'One final mark before the Order recognizes you.',tone:'auth',effect:'threshold',symbol:'∴',chapter:'IX'}],
];

function getScene(pathname:string):Scene {
  if (pathname === '/admin') return scenes.find(([prefix]) => prefix === '/admin')![1];
  return scenes.find(([prefix]) => prefix !== '/admin' && (pathname === prefix || pathname.startsWith(`${prefix}/`)))?.[1]
    ?? {eyebrow:'THE ORDER',title:'THE FIRST AWAKENING',subtitle:'The world stirs beyond the veil.',tone:'home',effect:'awakening',symbol:'✦',chapter:'X'};
}

const FULL_CINEMATIC_DURATION = 1800;

export function CinematicTransition(){
 const pathname=usePathname();
 const [visible,setVisible]=useState(true);
 const [scene,setScene]=useState(()=>getScene(pathname));
 const [transitionId,setTransitionId]=useState(0);
 const timerRef=useRef<number|null>(null);

 useEffect(()=>{
  const nextScene=getScene(pathname);
  setScene(nextScene);
  setTransitionId(id=>id+1);
  setVisible(pathname !== '/');
  document.documentElement.dataset.ascendScene=nextScene.tone;
  document.documentElement.dataset.ascendEffect=nextScene.effect;
  if(timerRef.current!==null)window.clearTimeout(timerRef.current);
  if(pathname !== '/') timerRef.current=window.setTimeout(()=>setVisible(false),FULL_CINEMATIC_DURATION);
  return()=>{if(timerRef.current!==null)window.clearTimeout(timerRef.current);};
 },[pathname]);

 // The title screen has its own full-screen film sequence.
 if(pathname === '/') return null;
 if(!visible)return null;
 const style={'--cin-duration':`${FULL_CINEMATIC_DURATION}ms`} as CSSProperties;
 return <div key={`${pathname}-${transitionId}`} className={`ascend-cinematic ascend-cinematic--${scene.tone} ascend-cinematic--effect-${scene.effect} ascend-cinematic--full`} style={style} aria-hidden="true"><div className="ascend-cinematic__veil"/><div className="ascend-cinematic__scene"/><div className="ascend-cinematic__effect"><i/><i/><i/><i/><i/><i/></div><div className="ascend-cinematic__sigil"><span>{scene.chapter}</span></div><div className="ascend-cinematic__content"><div className="ascend-cinematic__seal">{scene.symbol}</div><div className="ascend-cinematic__eyebrow">{scene.eyebrow}</div><h1>{scene.title}</h1><p>{scene.subtitle}</p><div className="ascend-cinematic__line"/></div></div>;
}
