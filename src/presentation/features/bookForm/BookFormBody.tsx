import { useParams } from "react-router-dom";
import { Text } from "@presentation/components";

const _BookFormBody = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-2">
      <Text variant="h1">{id ? `Edit Book #${id}` : "New Book"}</Text>
      <Text variant="body" tone="muted">
        Book form shell ready.
      </Text>
    </div>
  );
};

export default _BookFormBody;
