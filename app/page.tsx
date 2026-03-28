"use client";

import { MountainField } from "@/components/ui/mountain-field";
import { FogField } from "@/components/ui/fog-field";
import { CloudField } from "@/components/ui/cloud-field";
import { CursorTrail } from "@/components/ui/cursor-trail";
import { FloatingNav } from "@/components/layout/floating-nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Interstitial } from "@/components/sections/interstitial";
import { TheProof } from "@/components/sections/the-proof";
import { Gallery } from "@/components/sections/gallery";
import { Dataflow } from "@/components/sections/dataflow";
import { Tokenomics } from "@/components/sections/tokenomics";
import { ContractInfo } from "@/components/sections/contract-info";
import { Community } from "@/components/sections/community";
import { Marquee } from "@/components/ui/marquee";
import { SceneManager } from "@/components/ui/scene-manager";
import { Scene } from "@/components/ui/scene";
import { SceneNav } from "@/components/ui/scene-nav";
import { interstitials } from "@/data/interstitials";

export default function Home() {
  return (
    <>
      <MountainField />
      <FogField />
      <CloudField />
      <CursorTrail />
      <FloatingNav />
      <SceneNav />

      <main>
        <SceneManager>
          {/* Scene 0: Hero */}
          <Scene index={0} id="hero" scrollHeight="300vh" transition="ZOOM_OUT_TO_COSMOS">
            {(progress) => <Hero activeProgress={progress} />}
          </Scene>

          {/* Scene 1: The Doubt */}
          <Scene index={1} id="manifesto" scrollHeight="300vh" transition="DEPTH_DIVE">
            {(progress) => <Manifesto activeProgress={progress} />}
          </Scene>

          {/* Scene 2: The Grind — full-bleed darkness */}
          <Scene index={2} scrollHeight="150vh" transition="CINEMATIC_WIPE">
            {(progress) => (
              <Interstitial
                quote={interstitials[0].quote}
                bgImage={interstitials[0].bgImage}
                activeProgress={progress}
              />
            )}
          </Scene>

          {/* Scene 3: The Proof */}
          <Scene index={3} scrollHeight="300vh" transition="SETTLE_DOWN">
            {(progress) => <TheProof activeProgress={progress} />}
          </Scene>

          {/* Scene 4: The Path */}
          <Scene index={4} scrollHeight="400vh" transition="FOLD_AWAY">
            {(progress) => <Dataflow activeProgress={progress} />}
          </Scene>

          {/* Scene 5: Gallery */}
          <Scene index={5} id="gallery" scrollHeight="200vh" transition="SETTLE_DOWN">
            {() => <Gallery />}
          </Scene>

          {/* Scene 6: Marquee + Tokenomics */}
          <Scene index={6} id="tokenomics" scrollHeight="200vh" transition="ZOOM_OUT_TO_COSMOS">
            {() => (
              <div className="flex h-screen flex-col">
                <Marquee text="1 COMPUTER 1 DREAM • $1COMPUTER ON SOLANA •" reverse speed={25} />
                <div className="flex flex-1 items-center justify-center">
                  <Tokenomics />
                </div>
              </div>
            )}
          </Scene>

          {/* Scene 7: Contract Info */}
          <Scene index={7} id="buy" scrollHeight="200vh" transition="CINEMATIC_WIPE">
            {() => <ContractInfo />}
          </Scene>

          {/* Scene 8: The Summit — final interstitial */}
          <Scene index={8} scrollHeight="150vh" transition="SHATTER">
            {(progress) => (
              <Interstitial
                quote={interstitials[1].quote}
                bgImage={interstitials[1].bgImage}
                activeProgress={progress}
              />
            )}
          </Scene>

          {/* Scene 9: Community + Marquee */}
          <Scene index={9} scrollHeight="200vh" transition="DEPTH_DIVE">
            {() => (
              <div className="flex h-screen flex-col">
                <div className="flex flex-1 items-center justify-center">
                  <Community />
                </div>
                <Marquee text="WIFI AND A VISION • 1 COMPUTER 1 DREAM • $1COMPUTER •" speed={30} />
              </div>
            )}
          </Scene>
        </SceneManager>
      </main>

      <Footer />
    </>
  );
}
