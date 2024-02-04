import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import options from "./tsparticles-options.json"
import Foreground from "./Foreground";

function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <Particles options={options} init={particlesInit} />
      <Foreground/>
    </>
  )
}

export default App
