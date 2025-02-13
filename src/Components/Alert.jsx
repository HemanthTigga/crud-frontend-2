export default function Alert({ message, onClose }) {
    return (
      <>
        <div
          role="alert"
          className="fixed rounded-xl border border-gray-100 bg-transparent p-4 left-1/2 top-2 transform -translate-x-1/2 z-50 w-full max-w-lg backdrop-blur-md m-1 mt-0"
        >
          <div className="flex items-start gap-4">
            <span className="text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
  
            <div className="flex-1">
              <strong className="block font-medium text-amber-200">
                {" "}
                Alert{" "}
              </strong>
  
              <p className="mt-1 text-sm text-amber-100">
                {message}
              </p>
            </div>
  
            <button
              className="text-gray-500 transition hover:text-gray-600"
              onClick={onClose}
            >
              <span className="sr-only">Dismiss popup</span>
  
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }