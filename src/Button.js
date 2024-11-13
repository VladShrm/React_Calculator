import './Button.css';

function Button({ label, handleClick }) {
 
  return (
    <button className="calculator-button" data-label={label} onClick={()=>handleClick(label)}><span>{label}</span></button>
  );
}

export default Button;