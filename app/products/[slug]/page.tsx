import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getBaseSku, getProductBySlug, getProducts } from '@/lib/catalog';

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product not found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'article',
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const currentProduct = product!;
  const currentBaseSku = getBaseSku(currentProduct.sku);
  const currentPackageGroup = currentProduct.packageGroup;
  const relatedProducts = getProducts()
    .filter(
      (item) =>
        item.slug !== currentProduct.slug &&
        item.type === currentProduct.type &&
        (!currentPackageGroup || item.packageGroup !== currentPackageGroup) &&
        !(item.name === currentProduct.name && getBaseSku(item.sku) === currentBaseSku),
    )
    .slice(0, 3);
  const serializeProduct = (item: typeof currentProduct) => {
    const { createdAt, updatedAt, ...serializable } = item;
    return serializable;
  };

  return (
    <>
      <Navbar />
      <ProductDetailClient
        product={serializeProduct(currentProduct)}
        relatedProducts={relatedProducts.map(serializeProduct)}
      />
      <Footer />
    </>
  );
}
