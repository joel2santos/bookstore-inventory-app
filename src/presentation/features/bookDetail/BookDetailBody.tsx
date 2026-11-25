import { useParams } from "react-router-dom";
import { Text } from "@presentation/components";

const _BookDetailBody = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-2">
      <Text variant="h1">Book Details #{id}</Text>
      <Text variant="body" tone="muted">
        Book detail & price calculator shell ready.
      </Text>
    </div>
  );
};

export default _BookDetailBody;
