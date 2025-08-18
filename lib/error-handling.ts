// Error handling utilities for video animation system

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode: number
}

export class VideoGenerationError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: any

  constructor(code: string, message: string, statusCode: number = 500, details?: any) {
    super(message)
    this.name = 'VideoGenerationError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }

  toApiResponse() {
    return {
      error: this.message,
      code: this.code,
      details: this.details
    }
  }
}

// Predefined error types
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_USER: 'INVALID_USER',
  
  // Credit errors
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  CREDIT_DEDUCTION_FAILED: 'CREDIT_DEDUCTION_FAILED',
  
  // File validation errors
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  NO_FILE_PROVIDED: 'NO_FILE_PROVIDED',
  
  // FAL API errors
  FAL_API_KEY_MISSING: 'FAL_API_KEY_MISSING',
  FAL_UPLOAD_FAILED: 'FAL_UPLOAD_FAILED',
  FAL_GENERATION_FAILED: 'FAL_GENERATION_FAILED',
  FAL_RATE_LIMITED: 'FAL_RATE_LIMITED',
  FAL_TIMEOUT: 'FAL_TIMEOUT',
  FAL_INVALID_RESPONSE: 'FAL_INVALID_RESPONSE',
  
  // Storage errors
  BLOB_UPLOAD_FAILED: 'BLOB_UPLOAD_FAILED',
  BLOB_DOWNLOAD_FAILED: 'BLOB_DOWNLOAD_FAILED',
  BLOB_DELETE_FAILED: 'BLOB_DELETE_FAILED',
  
  // Database errors
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  GENERATION_NOT_FOUND: 'GENERATION_NOT_FOUND',
  
  // General errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  TIMEOUT: 'TIMEOUT'
} as const

// Error factory functions
export const createError = {
  unauthorized: (message = 'Authentication required') => 
    new VideoGenerationError(ErrorCodes.UNAUTHORIZED, message, 401),
    
  insufficientCredits: (required = 1, available = 0) => 
    new VideoGenerationError(
      ErrorCodes.INSUFFICIENT_CREDITS, 
      `Insufficient credits. Required: ${required}, Available: ${available}`, 
      402,
      { required, available }
    ),
    
  invalidFileType: (allowedTypes: string[]) => 
    new VideoGenerationError(
      ErrorCodes.INVALID_FILE_TYPE, 
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 
      400,
      { allowedTypes }
    ),
    
  fileTooLarge: (maxSize: number, actualSize: number) => 
    new VideoGenerationError(
      ErrorCodes.FILE_TOO_LARGE, 
      `File too large. Maximum size: ${maxSize}MB, Actual size: ${(actualSize / 1024 / 1024).toFixed(2)}MB`, 
      400,
      { maxSize, actualSize }
    ),
    
  falApiError: (message: string, details?: any) => 
    new VideoGenerationError(
      ErrorCodes.FAL_GENERATION_FAILED, 
      `FAL API error: ${message}`, 
      502,
      details
    ),
    
  blobStorageError: (operation: string, message: string) => 
    new VideoGenerationError(
      ErrorCodes.BLOB_UPLOAD_FAILED, 
      `Blob storage ${operation} failed: ${message}`, 
      500,
      { operation }
    ),
    
  databaseError: (operation: string, message: string) => 
    new VideoGenerationError(
      ErrorCodes.DB_QUERY_FAILED, 
      `Database ${operation} failed: ${message}`, 
      500,
      { operation }
    ),
    
  generationNotFound: (id: string) => 
    new VideoGenerationError(
      ErrorCodes.GENERATION_NOT_FOUND, 
      `Video generation not found: ${id}`, 
      404,
      { generationId: id }
    ),
    
  timeout: (operation: string, timeoutMs: number) => 
    new VideoGenerationError(
      ErrorCodes.TIMEOUT, 
      `Operation timed out: ${operation} (${timeoutMs}ms)`, 
      408,
      { operation, timeoutMs }
    )
}

// Error logging utility
export const logError = (error: Error | VideoGenerationError, context?: any) => {
  const errorInfo: any = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    stack: error.stack,
    context
  }
  
  if (error instanceof VideoGenerationError) {
    errorInfo.code = error.code
    errorInfo.statusCode = error.statusCode
    errorInfo.details = error.details
  }
  
  console.error('Video Generation Error:', JSON.stringify(errorInfo, null, 2))
}

// Utility to handle async operations with error wrapping
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorFactory: (error: any) => VideoGenerationError
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    const wrappedError = errorFactory(error)
    logError(wrappedError, { originalError: error })
    throw wrappedError
  }
}

// Retry utility for transient errors
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxRetries) {
        break
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    }
  }
  
  throw lastError!
}