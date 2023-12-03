import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

const ProductCardSkeleton = () => {
  return (
    <Card>
      <Skeleton height="100%" w={"100%"} />
    </Card>
  );
};

export default ProductCardSkeleton;
