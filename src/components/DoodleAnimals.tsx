import { motion } from "framer-motion";
import doodleCat from "@/assets/doodle-cat.png";
import doodleDog from "@/assets/doodle-dog.png";
import doodleOwl from "@/assets/doodle-owl.png";
import doodleRabbit from "@/assets/doodle-rabbit.png";
import doodleBird from "@/assets/doodle-bird.png";
import doodleFox from "@/assets/doodle-fox.png";

const animals = [
  { src: doodleCat, size: 80, x: "8%", y: "15%", duration: 18, delay: 0 },
  { src: doodleDog, size: 70, x: "85%", y: "25%", duration: 22, delay: 2 },
  { src: doodleOwl, size: 65, x: "75%", y: "70%", duration: 20, delay: 1 },
  { src: doodleRabbit, size: 60, x: "15%", y: "75%", duration: 24, delay: 3 },
  { src: doodleBird, size: 55, x: "50%", y: "10%", duration: 16, delay: 0.5 },
  { src: doodleFox, size: 70, x: "40%", y: "80%", duration: 21, delay: 1.5 },
];

const DoodleAnimals = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {animals.map((animal, i) => (
      <motion.img
        key={i}
        src={animal.src}
        alt=""
        className="absolute opacity-[0.12] invert"
        style={{
          width: animal.size,
          height: animal.size,
          left: animal.x,
          top: animal.y,
          objectFit: "contain",
        }}
        animate={{
          y: [0, -20, 0, 15, 0],
          x: [0, 10, -8, 5, 0],
          rotate: [0, 3, -2, 1, 0],
        }}
        transition={{
          duration: animal.duration,
          repeat: Infinity,
          delay: animal.delay,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default DoodleAnimals;
