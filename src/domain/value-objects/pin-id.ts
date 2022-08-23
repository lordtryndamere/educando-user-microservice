import { ValueObject } from './value-object';

interface PinIdProps {
  value: string;
}

export class PinId extends ValueObject<PinIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PinIdProps) {
    super(props);
  }

  public static create(pinId: string): PinId {
    if (pinId === undefined || pinId === null) {
      throw new Error('PinId cannot be null or undefined');
    } else {
      return new PinId({ value: pinId });
    }
  }
}
