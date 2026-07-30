import type { FormbuttonProps } from "global";



export default function Formbutton({ title, Icon, position="left", loading, type = "submit", disabled = false, onClick, className = "bg-yellow-dark text-white hover:bg-hovers" }: FormbuttonProps) {
  return (
    <div className={`relative`}>
      {(loading || disabled) && <div className={`absolute z-10 top-0 left-0 size-full rounded-full ${disabled ? 'cursor-not-allowed bg-white/50' : loading ? 'cursor-not-allowed bg-white/50' : 'cursor-pointer'}`}></div>}
      <button
        type={type}
        onClick={onClick}
        disabled={disabled ? true : loading ? true : false}
        className={`py-3.5 px-5 relative text-sm! truncate rounded-full outline-0! active:scale-95 transition-all w-full ${className} flex items-center gap-2 justify-center ${disabled ? `cursor-not-allowed` : loading ? `cursor-not-allowed` : `cursor-pointer`}`}>{(Icon && position === "left") && <Icon />} {title}
        {(Icon && position === "right") && <Icon />}
        {loading && <div className="absolute bottom-0 right-0">
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        </div>}
      </button>
    </div>
  )
}
