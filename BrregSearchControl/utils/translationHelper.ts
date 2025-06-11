import { IInputs } from '../generated/ManifestTypes';

export const getString = (
    context: ComponentFramework.Context<IInputs>,
    key: string
): string => {
    return context.resources.getString(key) || key;
};