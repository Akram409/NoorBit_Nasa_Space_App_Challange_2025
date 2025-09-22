import { CustomText } from "@/components/customText";
import { AnimatedTeamCard } from "@/components/ui/animated-testimonials";

function TeamSection() {
  const team = [
    {
      quote:
        "As a developer, I believe in writing clean code that not only works but lasts. Solving problems through logic is what keeps me motivated.",
      name: "Akram Hosen",
      designation: "Developer",
      src: "https://iili.io/Ka71PiF.jpg",
    },
    {
      quote:
        "Design is not just about how it looks, but how it feels. As a designer and leader, I try to bring simplicity, clarity, and empathy into every project.",
      name: "Amad Uddin Osama",
      designation: "UI/UX Designer, Leader",
      src: "https://iili.io/Ka714oP.png",
    },
    {
      quote:
        "Every frame tells a story. My passion is transforming ideas into visuals that connect with people emotionally and creatively.",
      name: "Mahmudul Hasan Jobaier",
      designation: "Video Editor, Script Writer",
      src: "https://iili.io/Ka718Hx.jpg",
    },
    {
      quote:
        "Data always has a story to tell. My role is to uncover insights and patterns that help us make smarter decisions.",
      name: "Iftehad Kamal Iftee",
      designation: "Data Analyst",
      src: "https://iili.io/Ka71SAQ.jpg",
    },
    {
      quote:
        "Research is about curiosity and persistence. I believe in asking the right questions and finding answers that create real impact.",
      name: "Shahriar Alam",
      designation: "Researcher",
      src: "https://iili.io/Ka71gDB.jpg",
    },
  ];
  // const team = [
  //     {
  //       quote:
  //         "As a developer, I believe in writing clean code that not only works but lasts. Solving problems through logic is what keeps me motivated.",
  //       name: "Akram Hosen",
  //       designation: "Developer",
  //       src: "https://i.ibb.co.com/fzLnwZnD/IMG-0429.jpg",
  //     },
  //     {
  //       quote:
  //         "Design is not just about how it looks, but how it feels. As a designer and leader, I try to bring simplicity, clarity, and empathy into every project.",
  //       name: "Amad Uddin Osama",
  //       designation: "UI/UX Designer, Leader",
  //       src: "https://i.ibb.co.com/2Y51SqVX/amad.png",
  //     },
  //     {
  //       quote:
  //         "Every frame tells a story. My passion is transforming ideas into visuals that connect with people emotionally and creatively.",
  //       name: "Mahmudul Hasan Jobaier",
  //       designation: "Video Editor, Script Writer",
  //       src: "https://i.ibb.co.com/yH8PNZB/6233374195639765511.jpg",
  //     },
  //     {
  //       quote:
  //         "Data always has a story to tell. My role is to uncover insights and patterns that help us make smarter decisions.",
  //       name: "Iftehad Kamal Iftee",
  //       designation: "Data Analyst",
  //       src: "https://i.ibb.co.com/twfrQ8q1/6152160281082582090.jpg",
  //     },
  //     {
  //       quote:
  //         "Research is about curiosity and persistence. I believe in asking the right questions and finding answers that create real impact.",
  //       name: "Shahriar Alam",
  //       designation: "Researcher",
  //       src: "https://i.ibb.co.com/yFPpzh3y/6154604851913410356.jpg",
  //     },
  //   ];

  return (
    <div className="bg-gradient-to-br dark:from-black dark:to-black mb-20">
      {/* Header Section */}
      <div className="text-center">
        <CustomText name="Our Team" />
      </div>

      <AnimatedTeamCard team={team} />
    </div>
  );
}

export { TeamSection };
