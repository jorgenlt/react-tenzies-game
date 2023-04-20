export default function Die(props) {
    return (
        <div 
            className={props.isHeld ? "dies--die held": "dies--die rotate-scale-up"}
            onClick={props.holdDice}
        >
            {props.value}
        </div>
    )
}