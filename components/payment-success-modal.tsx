"use client"

import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  userCredits: number
}

export default function PaymentSuccessModal({ isOpen, onClose, userCredits }: PaymentSuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <ModalHeader className="text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
        </div>
      </ModalHeader>
      
      <ModalBody className="text-center">
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Your payment has been processed successfully.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              You now have <span className="font-bold text-green-900">{userCredits} credits</span> to restore your images!
            </p>
          </div>
          <p className="text-sm text-gray-600">
            You can start uploading and restoring your images right away.
          </p>
        </div>
      </ModalBody>
      
      <ModalFooter className="justify-center">
        <Button 
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
        >
          Start Restoring Images
        </Button>
      </ModalFooter>
    </Modal>
  )
}