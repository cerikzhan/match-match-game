import Controller from './controler';

function getRouteInfo(): string {
  const hash = window.location.hash ? window.location.hash.slice(1) : '';
  return hash;
}

function handleHash(): void {
  const name = getRouteInfo();

  if (name) {
    const roteName: keyof typeof Controller =
      `${name}Route` as keyof typeof Controller;
    Controller[roteName]();
  } else {
    Controller.landingRoute();
  }
}

export default {
  init(): void {
    window.addEventListener('hashchange', handleHash);
    handleHash();
  },
};
