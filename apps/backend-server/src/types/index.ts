export type S3UploadObjectType = {
  bucket: string,
  uploadFileKey: string,
  partNumber: number
  uploadId: string
}
export interface InitiateMultipartUploadType extends Omit<S3UploadObjectType, 'partNumber'> {
  responseType: string,
  error: any
}

export type UploadPartDataType = {
  partNumber: number,
  eTag: string // Entity Tag of part uploaded to S3 bucket
}

export interface DoMultipartUploadType extends S3UploadObjectType {
  body: FileReader
}

export type CompleteMultipartUploadType = {
  bucket: string,
  uploadFileKey: string,
  uploadId: string,
  parts: UploadPartDataType[]
}
