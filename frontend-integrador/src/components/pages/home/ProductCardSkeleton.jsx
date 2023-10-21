import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react"


const ProductCardSkeleton = () => {

  return (
    <Card >
            <Skeleton height="50%" />
            <CardBody>
                <SkeletonText />
            </CardBody>
        </Card>
  )
}

export default ProductCardSkeleton