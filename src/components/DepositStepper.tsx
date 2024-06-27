import styles from "@/styles/depositStepper.module.scss"

interface DepositStepperProps {
    currentStep: number;
    stepLoading: boolean;
}

export const DepositStepper: React.FC<DepositStepperProps> = ({currentStep, stepLoading}) => {
    // Make it dynamically displayed to easily add new steps
    let steps = ["Approval", "Deposit"];
    return (
        <ul className={`${styles.steps} ${stepLoading ? styles.loading : ''}`}>
            {steps.map((step, index) => <li key={step} className={currentStep === index ? styles.active: currentStep < index ? styles.incomplete : styles.complete}>
                    <span className={styles.dot}></span>
                    <span>{step}</span>
                </li>
            )}
        </ul>
    );
};