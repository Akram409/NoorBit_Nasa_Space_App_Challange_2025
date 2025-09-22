import { AnimatedText } from "@/components/ui/animated-underline-text-one";

function CustomText({ name }) {
  return (
    <AnimatedText
      text={`${name}`}
      textClassName="text-4xl md:text-5xl lg:text-6xl mb-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 animate-gradient-x"
      underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
      underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
      underlineDuration={1.9}
    />
  );
}

export { CustomText };
