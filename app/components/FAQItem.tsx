import { FAQItemProps } from "@/types";

export default function FAQItem({question, answer}:FAQItemProps){
    return (
        <div>
            <h4 className="text-lg font-semibold mb-2 text-white">
                {question}
            </h4>
            <p className="text-gray-400 dark:text-gray-300">
                {answer}
            </p>
        </div>
    );
}