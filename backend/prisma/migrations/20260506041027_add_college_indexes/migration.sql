-- CreateIndex
CREATE INDEX "colleges_state_idx" ON "colleges"("state");

-- CreateIndex
CREATE INDEX "colleges_city_idx" ON "colleges"("city");

-- CreateIndex
CREATE INDEX "colleges_ownership_idx" ON "colleges"("ownership");

-- CreateIndex
CREATE INDEX "colleges_rating_idx" ON "colleges"("rating");

-- CreateIndex
CREATE INDEX "colleges_fees_idx" ON "colleges"("fees");

-- CreateIndex
CREATE INDEX "colleges_placementPercent_idx" ON "colleges"("placementPercent");

-- CreateIndex
CREATE INDEX "colleges_nirfRank_idx" ON "colleges"("nirfRank");

-- CreateIndex
CREATE INDEX "colleges_state_ownership_idx" ON "colleges"("state", "ownership");

-- CreateIndex
CREATE INDEX "colleges_state_rating_idx" ON "colleges"("state", "rating");

-- CreateIndex
CREATE INDEX "colleges_name_idx" ON "colleges"("name");
