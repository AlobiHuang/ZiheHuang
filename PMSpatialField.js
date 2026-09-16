import heroEntrance from './hero-entrance.js?v=20260916-speed-115';
import Waves from './Waves.js?v=20260915-inverted-pm-1';
const start = () => {
 const field = document.querySelector('[data-pm-spatial]');
 const canvas = field?.querySelector('canvas');
 const typeTarget = document.querySelector('[data-pm-title-type]');
 if (!field || !canvas || !typeTarget) return;
 const stop = Waves({
  container: field,
  canvas,
  lineColor: 'rgba(245, 245, 247, 0.52)',
  backgroundColor: '#1d1d1f',
  waveSpeedX: 0.02,
  waveSpeedY: 0.01,
  waveAmpX: 40,
  waveAmpY: 20,
  friction: 0.9,
  tension: 0.01,
  maxCursorMove: 120,
  xGap: 12,
  yGap: 36
 });
 heroEntrance({field,typeTarget,title:typeTarget.closest('.pm-spatial-title'),
 hero:field.closest('.pm-spatial-hero'),text:'PROJECTS',onDispose:stop});
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
