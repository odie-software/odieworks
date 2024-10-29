export interface Manifest {
    name: string,
    version: string
}

export interface Plugin {
    manifest: Manifest
}