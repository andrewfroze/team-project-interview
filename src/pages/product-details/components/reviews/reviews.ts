import type { Product } from "../../../../models/product";
import { createElement } from "../../../../utils/elementFactory";
import "./reviews.css";

function renderStars(rating: number): HTMLElement {
  const roundedRating = Math.round(rating);
  const stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

  return createElement(
    "span",
    {
      className: "product-reviews__rating",
      ariaLabel: `Rating: ${rating} out of 5`,
    },
    [stars],
  );
}

function formatReviewDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function renderReviews(product: Product): HTMLElement {
  const reviews = product.reviews.map((review) => {
    const header = createElement(
      "div",
      { className: "product-reviews__header" },
      [
        createElement("div", { className: "product-reviews__author-info" }, [
          createElement("h3", { className: "product-reviews__author" }, [
            review.reviewerName,
          ]),
          createElement("span", {
            className: "product-reviews__email",
            textContent: review.reviewerEmail,
          }),
        ]),
        renderStars(review.rating),
      ],
    );

    const comment = createElement(
      "p",
      { className: "product-reviews__comment" },
      [review.comment],
    );

    const date = createElement(
      "time",
      {
        className: "product-reviews__date",
        dateTime: review.date,
      },
      [formatReviewDate(review.date)],
    );

    return createElement("article", { className: "product-reviews__item" }, [
      header,
      comment,
      date,
    ]);
  });

  return createElement("div", { className: "product-reviews" }, reviews);
}
